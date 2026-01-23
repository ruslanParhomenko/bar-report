"use client";
import TextInput from "@/components/inputs/TextInput";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import {
  FieldArrayPath,
  Resolver,
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
import { EmployeesContextValue } from "@/providers/EmployeesProvider";
import { FormWrapper } from "@/components/wrapper/form-wrapper";
import { toast } from "sonner";
import {
  createEmployee,
  updateEmployee,
} from "@/app/actions/employees/employeeAction";
import { sendNotificationEmail } from "@/app/actions/mail/sendNotificationEmail";
import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import SelectField from "@/components/inputs/SelectField";
import { zodResolver } from "@hookform/resolvers/zod";
import { EMPLOYEES_ROLE } from "./constants";

type FormData = EmployeesSchemaTypeData & { id?: string };
const STATUS_OPTIONS = ["active", "fired"];

export function EmployeeForm({
  employee,
}: {
  employee: EmployeesContextValue | null;
}) {
  const router = useRouter();
  const nameTag = "vacationPay";
  const t = useTranslations("Home");

  const form = useForm<FormData>({
    resolver: zodResolver(employeesSchema) as Resolver<FormData>,
    defaultValues: employee ?? defaultEmployeeSchemaValues,
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

  const fieldClassName = "w-full h-12! border!";
  return (
    <FormWrapper
      form={form}
      onSubmit={handleSubmit}
      className={cn("flex flex-col md:px-4 h-[90vh]")}
      resetButton={employee?.id ? false : true}
      returnButton={employee?.id ? true : false}
      resetForm={form.reset}
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
                      className="flex-1 h-11"
                    />
                    <TextInput
                      fieldName={`vacationPay.${index}.countDays`}
                      className="flex-none w-11 p-0 h-11 text-center mx-4"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      className="h-11 w-11 flex-none"
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
                className="h-11 w-11 flex-none"
                onClick={() => append(defaultVacationPay)}
              >
                <Plus />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </FormWrapper>
  );
}
