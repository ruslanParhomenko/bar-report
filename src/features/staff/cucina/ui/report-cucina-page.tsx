"use client";
import { Textarea } from "@/components/ui/textarea";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  defaultReportCucina,
  ReportKitchenForm,
  schemaReportCucina,
} from "../model/schema";

import DatePickerInput from "@/components/input-form/date-input";
import FormWrapper from "@/components/wrapper/form-wrapper";
import { DataProducts } from "@/features/settings/setting/model/type";
import { useLocalStorageForm } from "@/hooks/use-local-storage";
import { useEmployees } from "@/providers/employees-provider";
import { MONTHS } from "@/utils/get-month-days";
import { zodResolver } from "@hookform/resolvers/zod";
import { createReportCucina } from "../actions/create-report-cucina";
import { getTablesConfig } from "../config/tables-config";
import RenderTableCucina from "./fields-form";

const CUCINA_EMPLOYEES = ["cook"];

const KEY_LOCALSTORAGE = "report-kitchen-form";

export function ReportCucinaPage({
  dataProducts,
}: {
  dataProducts: DataProducts | null;
}) {
  const employees = useEmployees();
  const employeesCucina = employees
    .filter((emp) => CUCINA_EMPLOYEES.includes(emp.role))
    .map((emp) => emp.name);

  const form = useForm<ReportKitchenForm>({
    defaultValues: defaultReportCucina,
    resolver: zodResolver(schemaReportCucina),
  });

  const { isLoaded } = useLocalStorageForm(form, KEY_LOCALSTORAGE);

  const onSubmit: SubmitHandler<ReportKitchenForm> = async (data) => {
    const { date, ...rest } = data;

    const dateObj = new Date(date);

    const day = String(dateObj.getDate());
    const month = MONTHS[dateObj.getMonth()];
    const year = dateObj.getFullYear().toString();

    try {
      await createReportCucina({
        year,
        month,
        day,
        report: rest,
      });

      form.reset({ ...defaultReportCucina, date: new Date().toISOString() });
      toast.success("Форма успешно отправлена!");
    } catch (error: any) {
      toast.error(error?.message || "Произошла ошибка");
    }
  };

  const tablesConfig = getTablesConfig(dataProducts, employeesCucina);

  if (!isLoaded) return null;

  const onError = () => {
    toast.error("Заполните обязательные красные поля");
  };

  return (
    <FormWrapper
      form={form}
      onSubmit={onSubmit}
      onError={onError}
      className="flex flex-col items-center justify-center"
    >
      <DatePickerInput
        fieldName="date"
        className="text-rd h-4 text-xs"
        disabled
      />

      {tablesConfig.map(
        ({
          name,
          placeHolder,
          dataFieldArray,
          defaultValue,
          dataShifts,
          dataReasons,
        }) => (
          <RenderTableCucina
            key={name}
            name={name}
            form={form}
            placeHolder={placeHolder}
            dataShifts={dataShifts}
            dataReasons={dataReasons}
            dataFieldArray={dataFieldArray}
            defaultValue={defaultValue}
          />
        ),
      )}
      <Textarea
        placeholder="notes ..."
        {...form.register("notes")}
        className="border-bl/40"
      />
    </FormWrapper>
  );
}
