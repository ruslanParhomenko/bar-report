"use client";
import { Textarea } from "@/components/ui/textarea";
import { ArrayPath, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { REASON, SELECT_TIME } from "./constants";
import RenderTableCucina from "./fields-form";
import {
  defaultReportCucina,
  productPreparedDefault,
  ProductPreparedType,
  ReportKitchenForm,
  ReportShiftType,
  ReportWriteOffType,
  schemaReportCucina,
  shiftDefault,
  writeOffDefault,
} from "./schema";

import { createDataProducts } from "@/app/actions/data-constants/data-products-action";
import { createReportKitchen } from "@/app/actions/report-kitchen/kitchen-action";
import DatePickerInput from "@/components/input-controlled/date-input";
import FormWrapper from "@/components/wrapper/form-wrapper";
import { useLocalStorageForm } from "@/hooks/use-local-storage";
import { useAbility } from "@/providers/ability-provider";
import { useEmployees } from "@/providers/employees-provider";
import { MONTHS } from "@/utils/get-month-days";
import { zodResolver } from "@hookform/resolvers/zod";

const CUCINA_EMPLOYEES = ["cook"];

const KEY_LOCALSTORAGE = "report-kitchen-form";

export default function KitchenReportPage({
  dataProducts,
}: {
  dataProducts: createDataProducts;
}) {
  const { isCucina, isAdmin } = useAbility();
  const isDisabled = !(isAdmin || isCucina);

  //employees
  const employees = useEmployees()
    .filter((emp) => CUCINA_EMPLOYEES.includes(emp.role))
    .map((emp) => emp.name);

  //form
  const form = useForm<ReportKitchenForm>({
    defaultValues: defaultReportCucina,
    resolver: zodResolver(schemaReportCucina),
  });

  const { isLoaded } = useLocalStorageForm(form, KEY_LOCALSTORAGE);

  const onSubmit: SubmitHandler<ReportKitchenForm> = async (data) => {
    const { date, ...rest } = data;

    if (!isCucina) return;

    const dateObj = new Date(date);

    const day = String(dateObj.getDate());
    const month = MONTHS[dateObj.getMonth()];
    const year = dateObj.getFullYear().toString();

    try {
      await createReportKitchen({
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

  const tablesConfig = [
    {
      name: "shifts",
      placeHolder: { fieldName: "employees", shift: "time", over: "over" },
      dataShifts: SELECT_TIME,
      dataFieldArray: employees,
      defaultValue: shiftDefault,
    },

    {
      name: "preparedSalads",
      placeHolder: {
        fieldName: "product",
        weight: "weight",
        time: "time",
      },
      dataFieldArray: dataProducts.salad,
      defaultValue: productPreparedDefault,
    },
    {
      name: "preparedFirst",
      placeHolder: {
        fieldName: "product",
        weight: "weight",
        time: "time",
      },
      dataFieldArray: dataProducts.soup,
      defaultValue: productPreparedDefault,
    },

    {
      name: "preparedGarnish",
      placeHolder: {
        fieldName: "product",
        weight: "weight",
        time: "time",
      },
      dataFieldArray: dataProducts.garnish,
      defaultValue: productPreparedDefault,
    },
    {
      name: "preparedSeconds",
      placeHolder: {
        fieldName: "product",
        weight: "weight",
        time: "time",
      },
      dataFieldArray: dataProducts.meat,
      defaultValue: productPreparedDefault,
    },
    {
      name: "preparedDesserts",
      placeHolder: {
        fieldName: "product",
        weight: "weight",
        time: "time",
      },
      dataFieldArray: dataProducts.dessert,
      defaultValue: productPreparedDefault,
    },
    {
      name: "cutting",
      placeHolder: {
        fieldName: "product",
        weight: "weight",
        time: "time",
      },
      dataFieldArray: [...dataProducts.semifinished, ...dataProducts.meat_fish],
      defaultValue: productPreparedDefault,
    },
    {
      name: "staff",
      placeHolder: {
        fieldName: "product",
        weight: "weight",
        time: "time",
      },
      dataFieldArray: dataProducts.staff,

      defaultValue: productPreparedDefault,
    },
    {
      name: "staffFurchet",
      placeHolder: {
        fieldName: "product",
        weight: "weight",
        time: "time",
      },
      dataFieldArray: [
        ...dataProducts.garnish,
        ...dataProducts.soup,
        ...dataProducts.meat,
      ],
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
      dataFieldArray: [
        ...dataProducts.ingredients,
        ...dataProducts.garnish,
        ...dataProducts.soup,
        ...dataProducts.meat,
      ],
      defaultValue: writeOffDefault,
    },
  ] satisfies Array<{
    name: ArrayPath<ReportKitchenForm>;
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
    defaultValue: ReportShiftType | ProductPreparedType | ReportWriteOffType;
  }>;

  if (!isLoaded) return null;

  const onError = () => {
    toast.error("Заполните обязательные красные поля");
  };

  return (
    <FormWrapper form={form} onSubmit={onSubmit} onError={onError}>
      <DatePickerInput
        fieldName="date"
        className="text-rd h-6 text-sm"
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
        className="border-bl/40"
      />
    </FormWrapper>
  );
}
