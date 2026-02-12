"use client";
import { Resolver, useForm, useWatch } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
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
import { toast } from "sonner";
import RenderTableCucina from "./fields-form";

import { useEmployees } from "@/providers/EmployeesProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useAbility } from "@/providers/AbilityProvider";
import {
  createReportCucina,
  realtimeReportCucina,
} from "@/app/actions/report-cucina/report-cucina-action";
import { MONTHS } from "@/utils/getMonthDays";
import FormInput from "@/components/wrapper/form";

export default function ReportCucinaForm({
  realtimeData,
}: {
  realtimeData?: ReportCucinaType;
}) {
  const { isCucina, isAdmin } = useAbility();
  const isDisabled = !(isAdmin || isCucina);
  //employees
  const employees = useEmployees()
    .filter((emp) => CUCINA_EMPLOYEES.includes(emp.role))
    .map((emp) => emp.name);

  //form
  const form = useForm<ReportCucinaType>({
    defaultValues: realtimeData ? realtimeData : defaultReportCucina,
    resolver: zodResolver(schemaReportCucina) as Resolver<ReportCucinaType>,
  });

  const reportValues = useWatch({
    control: form.control,
  });

  useEffect(() => {
    if (!isCucina) return;
    const timeoutRef = { current: null as NodeJS.Timeout | null };

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const data = form.getValues() as ReportCucinaType;

      realtimeReportCucina(data).catch(console.error);
      toast.info("Автосохранение отчёта ...", { duration: 4000 });
    }, 7000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [reportValues]);

  const onSubmit = async (data: ReportCucinaType) => {
    const { date, ...rest } = data;
    const dateValue = new Date(date);
    const month = MONTHS[dateValue.getMonth()];
    const year = dateValue.getFullYear().toString();
    const day = dateValue.getDate().toLocaleString();
    const uniqueKey = `${year}-${month}`;
    try {
      await createReportCucina(uniqueKey, year, month, { day, report: rest });

      await realtimeReportCucina(defaultReportCucina);

      form.reset(defaultReportCucina);
      toast.success("Форма успешно отправлена!");
    } catch (error: any) {
      toast.error(error?.message || "Произошла ошибка");
    }
  };

  return (
    <FormInput
      form={form}
      onSubmit={onSubmit}
      className="w-full  md:mx-auto md:max-w-6xl"
      disabled={isDisabled}
    >
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
        isDisabled={isDisabled}
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
        isDisabled={isDisabled}
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
        isDisabled={isDisabled}
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
        isDisabled={isDisabled}
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
        isDisabled={isDisabled}
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
        isDisabled={isDisabled}
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
        isDisabled={isDisabled}
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
        isDisabled={isDisabled}
      />

      <Textarea
        placeholder="notes ..."
        {...form.register("notes")}
        disabled={isDisabled}
      />
    </FormInput>
  );
}
