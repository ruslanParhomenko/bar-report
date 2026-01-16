"use client";
import { Resolver, useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import DatePickerInput from "@/components/inputs/DatePickerInput";
import {
  defaultReportCucina,
  defaultShift,
  defaultWriteOff,
  productPreparedDefault,
  ReportCucinaType,
  schemaReportCucina,
} from "./schema";
import {
  CUCINA_EMPLOYEES,
  OVER_HOURS,
  PRODUCTS_DESSERT,
  PRODUCTS_GARNISH,
  PRODUCTS_INGREDIENTS,
  PRODUCTS_MEAT,
  PRODUCTS_MEAT_FISH,
  PRODUCTS_SALAD,
  PRODUCTS_SEMIFINISHED,
  PRODUCTS_SOUP,
  PRODUCTS_STAFF,
  REASON,
  REMAINS_PRODUCTS,
  SELECT_TIME,
} from "./constants";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import RenderTableCucina from "./RenderTableByFields";
import { REPORT_CUCINA_ENDPOINT } from "@/constants/endpoint-tag";

import { useEmployees } from "@/providers/EmployeesProvider";
import { createReportCucina } from "@/app/actions/archive/reportCucinaAction";
import { FormWrapper } from "@/components/wrapper/form-wrapper";
import { useLocalStorageForm } from "@/hooks/useLocalStorageForm";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ReportCucinaForm() {
  const t = useTranslations("Home");

  //employees
  const employees = useEmployees()
    .filter((emp) => CUCINA_EMPLOYEES.includes(emp.role))
    .map((emp) => emp.name);

  //form
  const form = useForm<ReportCucinaType>({
    defaultValues: schemaReportCucina.parse({}),
    resolver: zodResolver(schemaReportCucina) as Resolver<ReportCucinaType>,
  });

  // localstorage
  const { isLoaded, resetForm } = useLocalStorageForm(
    form,
    REPORT_CUCINA_ENDPOINT
  );

  const resetFormHandler = () => {
    resetForm(defaultReportCucina);
    toast.success("Форма успешно очищена!");
  };

  const onSubmit = async (data: ReportCucinaType) => {
    try {
      await createReportCucina({ data: data });

      resetForm(defaultReportCucina);
      toast.success("Форма успешно отправлена!");
    } catch (error: any) {
      toast.error(error?.message || "Произошла ошибка");
    }
  };

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        ...loading
      </div>
    );
  }

  return (
    <FormWrapper
      form={form}
      onSubmit={onSubmit}
      className="w-full  md:mx-auto md:max-w-6xl"
      resetButton={true}
      resetForm={resetFormHandler}
    >
      <div className="flex w-full justify-end">
        <DatePickerInput fieldName="date" className="text-sm h-6 text-rd" />
      </div>

      <RenderTableCucina
        name="shifts"
        form={form}
        placeHolder={{
          field1: "employees",
          field2: "time",
          field3: "over",
        }}
        dataArrayField1={employees}
        dataArrayField2={SELECT_TIME}
        dataArrayField3={OVER_HOURS}
        defaultValue={defaultShift}
      />

      <RenderTableCucina
        name="remains"
        form={form}
        placeHolder={{
          field1: "product",
          field2: "portions",
          field3: "weight",
          field4: "time",
        }}
        dataArrayField1={REMAINS_PRODUCTS}
        defaultValue={productPreparedDefault}
      />

      <RenderTableCucina
        name="preparedSalads"
        form={form}
        placeHolder={{
          field1: "product",
          field2: "portions",
          field3: "weight",
          field4: "time",
        }}
        dataArrayField1={[
          ...PRODUCTS_GARNISH,
          ...PRODUCTS_SALAD,
          ...PRODUCTS_SOUP,
        ]}
        defaultValue={productPreparedDefault}
      />

      <RenderTableCucina
        name="preparedSeconds"
        form={form}
        placeHolder={{
          field1: "product",
          field2: "portions",
          field3: "weight",
          field4: "time",
        }}
        dataArrayField1={PRODUCTS_MEAT}
        defaultValue={productPreparedDefault}
      />

      <RenderTableCucina
        name="preparedDesserts"
        form={form}
        placeHolder={{
          field1: "product",
          field2: "portions",
          field3: "weight",
          field4: "time",
        }}
        dataArrayField1={PRODUCTS_DESSERT}
        defaultValue={productPreparedDefault}
      />

      <RenderTableCucina
        name="cutting"
        form={form}
        placeHolder={{
          field1: "product",
          field2: "portions",
          field3: "weight",
          field4: "time",
        }}
        dataArrayField1={[...PRODUCTS_SEMIFINISHED, ...PRODUCTS_MEAT_FISH]}
        defaultValue={productPreparedDefault}
      />

      <RenderTableCucina
        name="staff"
        form={form}
        placeHolder={{
          field1: "product",
          field2: "portions",
          field3: "weight",
          field4: "time",
        }}
        dataArrayField1={PRODUCTS_STAFF}
        defaultValue={productPreparedDefault}
      />

      <RenderTableCucina
        name="writeOff"
        form={form}
        placeHolder={{
          field1: "product",
          field2: "weight",
          field3: "reason",
        }}
        dataArrayField1={PRODUCTS_INGREDIENTS}
        dataArrayField3={REASON}
        defaultValue={defaultWriteOff}
      />

      <Textarea placeholder="notes ..." {...form.register("notes")} />
    </FormWrapper>
  );
}
