"use client";
import TextInput from "@/components/inputs/text-input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import {
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import DatePickerInput from "@/components/inputs/date-input";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { DatePickerRange } from "@/components/inputs/date-range-input";
import { cn } from "@/lib/utils";
import { useEmployees } from "@/providers/employees-provider";
import { toast } from "sonner";
import {
  createEmployee,
  updateEmployee,
} from "@/app/actions/employees/employee-action";
import { sendNotificationEmail } from "@/app/actions/mail/email-action";
import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import SelectField from "@/components/inputs/select-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAbility } from "@/providers/ability-provider";
import FormInput from "@/components/wrapper/form";
import {
  defaultEmployeeSchemaValues,
  defaultVacationPay,
  employeesSchema,
  EmployeesSchemaTypeData,
} from "./schema";
import { EMPLOYEES_ROLE } from "./constants";

type FormData = EmployeesSchemaTypeData & { id?: string };
const STATUS_OPTIONS = ["active", "fired"];

export function EmployeeForm({ id }: { id?: string }) {
  const { isAdmin, isManager } = useAbility();
  const isDisabled = !isAdmin && !isManager;

  const router = useRouter();
  const nameTag = "vacationPay";
  const t = useTranslations("Home");

  const employee = id
    ? useEmployees().find((e: any) => e.id === id)
    : undefined;

  const form = useForm<EmployeesSchemaTypeData>({
    resolver: zodResolver(employeesSchema),
    defaultValues: employee || defaultEmployeeSchemaValues,
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: nameTag,
  });
  const vacationPayValues = useWatch({
    control: form.control,
    name: nameTag,
  });

  const handleSubmit: SubmitHandler<FormData> = async (data) => {
    if (id) {
      await updateEmployee(id, data);
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

  const fieldClassName = "w-full h-10! border!";
  return (
    <FormInput
      form={form}
      onSubmit={handleSubmit}
      className={cn("flex flex-col md:px-4 h-[90vh]")}
      resetButton={id ? false : true}
      returnButton={id ? true : false}
      disabled={isDisabled}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-8 mt-4">
        <div className="flex flex-col md:gap-6">
          <TextInput
            fieldName="name"
            fieldLabel={t("name")}
            type="text"
            className={fieldClassName}
          />
          <SelectField
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
          <SelectField
            data={STATUS_OPTIONS}
            fieldName="status"
            fieldLabel={t("status")}
            className={fieldClassName}
          />
          <DatePickerInput
            fieldName="employmentDate"
            fieldLabel={t("employmentDate")}
            className={cn(fieldClassName, "border!")}
          />
        </div>
        <div>
          <Label className="mb-2">{t("usedVacationDays")}</Label>
          <div className="flex flex-col gap-6">
            {fields.map((field, index) => {
              const startDate = vacationPayValues?.[index]?.startDate;
              const endDate = vacationPayValues?.[index]?.endDate;
              return (
                <div key={field.id} className="flex flex-col  gap-4">
                  <div className="flex w-full">
                    <DatePickerRange
                      value={{
                        from: startDate ? new Date(startDate) : undefined,
                        to: endDate ? new Date(endDate) : undefined,
                      }}
                      onDataChange={(range) => {
                        if (range?.from && range?.to) {
                          const diffTime = Math.abs(
                            range.to.getTime() - range.from.getTime(),
                          );
                          const diffDays =
                            Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

                          form.setValue(
                            `vacationPay.${index}.startDate`,
                            range.from.toISOString(),
                          );
                          form.setValue(
                            `vacationPay.${index}.endDate`,
                            range.to.toISOString(),
                          );
                          form.setValue(
                            `vacationPay.${index}.countDays`,
                            diffDays.toString(),
                          );
                        }
                      }}
                      resetTrigger={false}
                      className="flex-1 h-10"
                    />
                    <TextInput
                      fieldName={`vacationPay.${index}.countDays`}
                      className="flex-none w-11 p-0 h-10 text-center mx-4"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      className="h-10 w-10 flex-none"
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
            <div className="flex justify-end">
              <Button
                type="button"
                className="h-10 w-10 flex-none"
                onClick={() => append(defaultVacationPay)}
              >
                <Plus />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </FormInput>
  );
}
