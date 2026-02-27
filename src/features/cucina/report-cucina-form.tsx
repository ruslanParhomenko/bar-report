"use client";
import { ArrayPath, SubmitHandler, useForm, useWatch } from "react-hook-form";
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

import { useEmployees } from "@/providers/employees-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useAbility } from "@/providers/ability-provider";
import {
  createReportCucina,
  realtimeReportCucina,
} from "@/app/actions/report-cucina/report-cucina-action";
import { MONTHS } from "@/utils/get-month-days";
import FormInput from "@/components/wrapper/form";
import { useRealtimeSave } from "@/hooks/use-realtime-save";
import DatePickerInput from "@/components/inputs/date-input";
import { parseISO } from "date-fns";

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
    defaultValues: realtimeData ?? defaultReportCucina,
    resolver: zodResolver(schemaReportCucina),
  });

  const reportValues = useWatch({
    control: form.control,
  });
  useRealtimeSave<ReportCucinaType>(
    reportValues as ReportCucinaType,
    isCucina,
    async (data) => {
      if (!data) return;
      await realtimeReportCucina(data).catch(console.error);
      toast.success("сохранение…", { duration: 2000 });
    },
  );

  const onSubmit: SubmitHandler<ReportCucinaType> = async (data) => {
    const { date, ...rest } = data;

    const dateValue = typeof date === "string" ? parseISO(date) : date;
    const month = MONTHS[dateValue.getMonth()];
    const year = dateValue.getFullYear().toString();
    const day = String(dateValue.getDate());

    const uniqueKey = `${year}-${month}`;

    try {
      await createReportCucina(uniqueKey, year, month, { day, report: rest });

      form.reset(defaultReportCucina);
      toast.success("Форма успешно отправлена!");
    } catch (error: any) {
      toast.error(error?.message || "Произошла ошибка");
    }
  };

  useEffect(() => {
    if (!realtimeData) return;

    form.reset({
      ...defaultReportCucina,
      ...realtimeData,
      date:
        realtimeData.date instanceof Date
          ? realtimeData.date
          : new Date(realtimeData.date),
    });
  }, [realtimeData, form]);

  const tablesConfig = [
    {
      name: "shifts",
      placeHolder: { fieldName: "employees", shift: "time", over: "over" },
      dataShifts: SELECT_TIME,
      dataFieldArray: employees,
      defaultValue: defaultShift,
    },
    {
      name: "remains",
      placeHolder: {
        fieldName: "product",
        weight: "weight",
        time: "time",
      },
      dataFieldArray: REMAINS_PRODUCTS,
      defaultValue: productPreparedDefault,
    },
    {
      name: "preparedSalads",
      placeHolder: {
        fieldName: "product",
        weight: "weight",
        time: "time",
      },
      dataFieldArray: [
        ...PRODUCTS_GARNISH,
        ...PRODUCTS_SALAD,
        ...PRODUCTS_SOUP,
      ],

      defaultValue: productPreparedDefault,
    },
    {
      name: "preparedSeconds",
      placeHolder: {
        fieldName: "product",
        weight: "weight",
        time: "time",
      },
      dataFieldArray: PRODUCTS_MEAT,
      defaultValue: productPreparedDefault,
    },
    {
      name: "preparedDesserts",
      placeHolder: {
        fieldName: "product",
        weight: "weight",
        time: "time",
      },
      dataFieldArray: PRODUCTS_DESSERT,
      defaultValue: productPreparedDefault,
    },
    {
      name: "cutting",
      placeHolder: {
        fieldName: "product",
        weight: "weight",
        time: "time",
      },
      dataFieldArray: [...PRODUCTS_SEMIFINISHED, ...PRODUCTS_MEAT_FISH],
      defaultValue: productPreparedDefault,
    },
    {
      name: "staff",
      placeHolder: {
        fieldName: "product",
        weight: "weight",
        time: "time",
      },
      dataFieldArray: PRODUCTS_STAFF,
      defaultValue: productPreparedDefault,
    },
    {
      name: "writeOff",
      placeHolder: {
        fieldName: "product",
        weight: "weight",
        reason: "reason",
      },
      dataReasons: REASON,
      dataFieldArray: PRODUCTS_INGREDIENTS,
      defaultValue: defaultWriteOff,
    },
  ] satisfies Array<{
    name: ArrayPath<ReportCucinaType>;
    placeHolder: {
      fieldName: string;
      weight?: string;
      shift?: string;
      over?: string;
      time?: string;
      reason?: string;
    };
    dataShifts?: string[];
    dataReasons?: string[];
    dataFieldArray: Array<string>;
    defaultValue: any;
  }>;

  return (
    <FormInput
      form={form}
      onSubmit={onSubmit}
      disabled={isDisabled}
      className="md:px-6"
    >
      <DatePickerInput
        fieldName="date"
        className="text-sm text-rd h-6"
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
            isDisabled={isDisabled}
          />
        ),
      )}

      <Textarea
        placeholder="notes ..."
        {...form.register("notes")}
        disabled={isDisabled}
        className="border-bl/40 "
      />
    </FormInput>
  );
}
