"use client";
import { Textarea } from "@/components/ui/textarea";
import { ArrayPath, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { REASON, SELECT_TIME } from "./constants";
import RenderTableCucina from "./fields-form";
import {
  defaultReportCucina,
  defaultShift,
  defaultWriteOff,
  productPreparedDefault,
  ReportCucinaInput,
  schemaReportCucina,
} from "./schema";

import { createDataProducts } from "@/app/actions/data-constants/data-products-action";
import { createReportCucina } from "@/app/actions/report-cucina/report-cucina-action";
import DatePickerInput from "@/components/input-controlled/date-input";
import { Form } from "@/components/ui/form";
import { useLocalStorageForm } from "@/hooks/use-local-storage";
import { useAbility } from "@/providers/ability-provider";
import { useEmployees } from "@/providers/employees-provider";
import { MONTHS } from "@/utils/get-month-days";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";

const CUCINA_EMPLOYEES = ["cook"];

const KEY_LOCALSTORAGE = "report-cucina";

export default function KitchenReportPage({
  dataProducts,
}: {
  dataProducts: createDataProducts;
}) {
  const pathname = usePathname();
  const formId = pathname.split("/").pop() || "";

  const { isCucina, isAdmin } = useAbility();
  const isDisabled = !(isAdmin || isCucina);

  const REMAINS_PRODUCTS = [
    ...dataProducts.salad,
    ...dataProducts.meat,
    ...dataProducts.garnish,
    ...dataProducts.dessert,
  ];

  //employees
  const employees = useEmployees()
    .filter((emp) => CUCINA_EMPLOYEES.includes(emp.role))
    .map((emp) => emp.name);

  //form
  const form = useForm<ReportCucinaInput>({
    defaultValues: defaultReportCucina,
    resolver: zodResolver(schemaReportCucina),
  });

  const { isLoaded } = useLocalStorageForm(form, KEY_LOCALSTORAGE);

  const onSubmit: SubmitHandler<ReportCucinaInput> = async (data) => {
    console.log(data, "ok");
    if (!isCucina) return;
    const parsed = schemaReportCucina.parse(data);
    const { date, ...rest } = parsed;

    const month = MONTHS[date.getMonth()];
    const year = date.getFullYear().toString();
    const day = String(date.getDate());

    const uniqueKey = `${year}-${month}`;

    try {
      await createReportCucina(uniqueKey, year, month, { day, report: rest });

      form.reset({ ...defaultReportCucina, date: new Date() });
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
        ...dataProducts.garnish,
        ...dataProducts.salad,
        ...dataProducts.soup,
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
      dataFieldArray: [
        ...dataProducts.staff,
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
      dataFieldArray: dataProducts.ingredients,
      defaultValue: defaultWriteOff,
    },
  ] satisfies Array<{
    name: ArrayPath<ReportCucinaInput>;
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

  if (!isLoaded) return null;

  const onError = () => {
    toast.error("Заполните обязательные красные поля");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} id={formId}>
        <DatePickerInput fieldName="date" className="text-rd h-6 text-sm" />
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
      </form>
    </Form>
  );
}
