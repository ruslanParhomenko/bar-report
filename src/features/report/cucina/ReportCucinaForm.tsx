"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import DatePickerInput from "@/components/inputs/DatePickerInput";
import {
  defaultMovement,
  defaultProductsCutting,
  defaultProductsDesserts,
  defaultProductsSalad,
  defaultProductsSeconds,
  defaultRemains,
  defaultReportCucina,
  defaultShift,
  defaultStaff,
  defaultWriteOff,
  ReportCucinaType,
  schemaReportCucina,
} from "./schema";
import { SendResetButton } from "@/components/buttons/SendResetButton";
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
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import RenderTableCucina from "./RenderTableByFields";
import { REPORT_CUCINA_ENDPOINT } from "@/constants/endpoint-tag";

import { useEmployees } from "@/providers/EmployeesProvider";
import { createReportCucina } from "@/app/actions/archive/reportCucinaAction";
import { FormWrapper } from "@/components/wrapper/FormWrapper";
import { useLocalStorageForm } from "@/hooks/useLocalStorageForm";

export default function ReportCucinaForm() {
  const t = useTranslations("Home");

  //employees
  const employees = useEmployees()
    .filter((emp) => CUCINA_EMPLOYEES.includes(emp.role))
    .map((emp) => emp.name);

  //form
  const form = useForm<ReportCucinaType>({
    defaultValues: defaultReportCucina,
    resolver: yupResolver(schemaReportCucina),
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

  const onSubmit: SubmitHandler<ReportCucinaType> = async (data) => {
    const invalidShift = data.shifts.some((shift) => !shift.employees?.trim());
    if (invalidShift) {
      toast.error("Заполните всех сотрудников в сменах!");
      return;
    }

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
      className="w-full md:px-10 md:mx-auto md:max-w-6xl"
    >
      <DatePickerInput fieldName="date" className="text-md" />

      {employees.length > 0 && (
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
          defaultValue={defaultShift[0]}
        />
      )}

      <RenderTableCucina
        name="remains"
        form={form}
        placeHolder={{
          field1: "product",
          field2: "portions",
          field3: "weight",
        }}
        dataArrayField1={REMAINS_PRODUCTS}
        defaultValue={defaultRemains[0]}
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
        defaultValue={defaultProductsSalad[0]}
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
        defaultValue={defaultProductsSeconds[0]}
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
        defaultValue={defaultProductsDesserts[0]}
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
        defaultValue={defaultProductsCutting[0]}
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
        defaultValue={defaultStaff[0]}
      />

      <RenderTableCucina
        name="movement"
        form={form}
        placeHolder={{
          field1: "nameOutside",
          field2: "nameInside",
          field3: "weight",
        }}
        dataArrayField1={PRODUCTS_INGREDIENTS}
        dataArrayField2={PRODUCTS_INGREDIENTS}
        defaultValue={defaultMovement[0]}
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
        defaultValue={defaultWriteOff[0]}
      />
      <Label className="font-semibold py-4 text-md text-bl">{t("notes")}</Label>
      <Textarea placeholder="notes ..." {...form.register("notes")} />
      <SendResetButton resetForm={resetFormHandler} reset={true} />
    </FormWrapper>
  );
}
