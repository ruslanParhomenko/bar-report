"use client";
import TextInput from "@/components/inputs/TextInput";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import {
  FieldArrayPath,
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import DatePickerInput from "@/components/inputs/DatePickerInput";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { DatePickerRange } from "@/components/inputs/DatePickerRange";
import {
  defaultEmployeeSchemaValues,
  defaultVacationPay,
  employeesSchema,
  EmployeesSchemaTypeData,
} from "./schema";
import { cn } from "@/lib/utils";
import SelectInput from "@/components/inputs/SelectInput";
import { EmployeesContextValue } from "@/providers/EmployeesProvider";
import { FormWrapper } from "@/components/wrapper/FormWrapper";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAbility } from "@/providers/AbilityProvider";
import { toast } from "sonner";
import {
  createEmployee,
  updateEmployee,
} from "@/app/actions/employees/employeeAction";
import { sendNotificationEmail } from "@/app/actions/mail/sendNotificationEmail";
import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { EMPLOYEES_ROLE } from "./SelectEmployeeBy";

type FormData = EmployeesSchemaTypeData & { id?: string };

export function AddEmployeeCard({
  employee,
}: {
  employee: EmployeesContextValue | null;
}) {
  const router = useRouter();
  const nameTag = "vacationPay";
  const t = useTranslations("Home");
  const { isAdmin, isManager } = useAbility();
  const disabled = !isAdmin && !isManager;

  const form = useForm<FormData>({
    resolver: yupResolver(employeesSchema),
    defaultValues: defaultEmployeeSchemaValues,
  });
  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: nameTag as FieldArrayPath<FormData>,
  });
  const vacationPayValues = useWatch({
    control: form.control,
    name: nameTag as FieldArrayPath<FormData>,
  });

  const handleSubmit: SubmitHandler<FormData> = async (data) => {
    if (employee?.id) {
      await updateEmployee(employee.id, data);
      toast.success("Employee updated!");

      await sendNotificationEmail({
        text: `updated employee:${data.name}`,
      });
    } else {
      await createEmployee(data);
      toast.success("Employee added!");
      await sendNotificationEmail({
        text: `add new employee:${data.name}-${data.role}-${data.rate}`,
      });
    }
    form.reset(defaultEmployeeSchemaValues);
    router.back();
  };

  useEffect(() => {
    if (employee) {
      form.reset(employee);
    }
  }, [employee, form]);

  const fieldClassName = "md:w-2/3 !h-10";
  return (
    <FormWrapper
      form={form}
      onSubmit={handleSubmit}
      className={cn("flex flex-col md:px-4 h-[90vh]")}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
        <div>
          <TextInput
            fieldName="name"
            fieldLabel={t("name")}
            type="text"
            className={fieldClassName}
          />
          <SelectInput
            data={EMPLOYEES_ROLE}
            fieldName="role"
            fieldLabel={t("role")}
            className={fieldClassName}
          />
          <TextInput
            fieldName="rate"
            fieldLabel={t("rate")}
            className={fieldClassName}
          />
          <TextInput
            fieldName="mail"
            fieldLabel={t("mail")}
            type="mail"
            className={fieldClassName}
          />
          <TextInput
            fieldName="tel"
            fieldLabel={t("tel")}
            type="tel"
            className={fieldClassName}
          />
        </div>
        <div>
          <DatePickerInput
            fieldName="employmentDate"
            fieldLabel={t("employmentDate")}
            className={cn(fieldClassName, "border!")}
          />
          <DatePickerInput
            fieldName="dismissalDate"
            fieldLabel={t("dismissalDate")}
            className={cn(fieldClassName, "border!")}
          />
          <TextInput
            fieldName="reason"
            fieldLabel={t("reason")}
            type="text"
            className={fieldClassName}
          />

          <Label className="py-4">{t("usedVacationDays")}</Label>
          {fields.map((field, index) => {
            const startDate = vacationPayValues?.[index]?.startDate;
            const endDate = vacationPayValues?.[index]?.endDate;
            return (
              <div key={field.id} className="flex flex-col w-2/3 gap-1">
                <div className="flex w-full">
                  <DatePickerRange
                    value={{
                      from: startDate ? new Date(startDate) : undefined,
                      to: endDate ? new Date(endDate) : undefined,
                    }}
                    onDataChange={(range) => {
                      if (range?.from && range?.to) {
                        const diffTime = Math.abs(
                          range.to.getTime() - range.from.getTime()
                        );
                        const diffDays =
                          Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

                        form.setValue(
                          `vacationPay.${index}.startDate`,
                          range.from.toISOString()
                        );
                        form.setValue(
                          `vacationPay.${index}.endDate`,
                          range.to.toISOString()
                        );
                        form.setValue(
                          `vacationPay.${index}.countDays`,
                          diffDays.toString()
                        );
                      }
                    }}
                    resetTrigger={false}
                    className="flex-1 h-10"
                  />
                  <TextInput
                    fieldName={`vacationPay.${index}.countDays`}
                    className="flex-none w-12 p-0 h-8 text-center mx-4"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    className="h-8 w-8 flex-none"
                    onClick={() =>
                      fields.length === 1
                        ? replace(defaultVacationPay)
                        : remove(index)
                    }
                  >
                    <Trash />
                  </Button>
                </div>
              </div>
            );
          })}
          <div className="w-2/3 flex justify-end">
            <Button
              type="button"
              className="h-8 w-8 flex-none"
              onClick={() => append(defaultVacationPay)}
            >
              <Plus />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-start gap-4 py-4 mt-auto">
        <Button
          className="cursor-pointer h-8"
          type="button"
          variant={"secondary"}
          onClick={() => {
            employee?.id
              ? router.back()
              : form.reset(defaultEmployeeSchemaValues);
          }}
        >
          {employee?.id ? t("cancel") : t("reset")}
        </Button>

        <Button className="h-8" type="submit" disabled={disabled}>
          {employee?.id ? (
            t("update")
          ) : (
            <>
              <Plus /> {t("add")}
            </>
          )}
        </Button>
      </div>
    </FormWrapper>
  );
}
