"use client";
import SelectField from "@/components/inputs-form/select-input";
import TextInput from "@/components/inputs-form/text-input";
import { useTranslations } from "next-intl";
import { EMPLOYEES_ROLE, STATUS_OPTIONS } from "./constants";
import DatePickerInput from "@/components/inputs-form/date-input";
import { cn } from "@/lib/utils";

export default function EmployeeDataForm() {
  const t = useTranslations("Home");

  const fieldClassName = "w-full h-10! border!";
  return (
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
  );
}
