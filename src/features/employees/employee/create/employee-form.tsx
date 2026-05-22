"use client";
import DatePickerInput from "@/components/input-controlled/date-input";
import SelectField from "@/components/input-controlled/select-field";
import TextInput from "@/components/input-controlled/text-input";
import { cn } from "@/lib/utils";
import { Minus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { EMPLOYEES_ROLE, STATUS_OPTIONS } from "./constants";

export default function EmployeeDataForm() {
  const t = useTranslations("Home");

  const { setValue } = useFormContext();

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
        data={EMPLOYEES_ROLE.map((r) => r.value)}
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
      <div className="flex w-full items-end justify-between gap-2 md:pr-10">
        <DatePickerInput
          fieldName="employmentDate"
          fieldLabel={t("employmentDate")}
          className={cn("h-10! w-60 border! md:w-100")}
        />

        <button
          type="button"
          onClick={() => setValue("employmentDate", "")}
          className="h-full rounded-md border-0 px-3 text-sm"
        >
          <Minus className="h-8 w-8 text-red-600" />
        </button>
      </div>
    </div>
  );
}
