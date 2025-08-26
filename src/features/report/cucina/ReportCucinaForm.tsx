"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import DatePickerInput from "@/components/inputs/DatePickerInput";
import { Form } from "@/components/ui/form";
import {
  defaultProductsCutting,
  defaultProductsDesserts,
  defaultProductsSalad,
  defaultProductsSeconds,
  defaultRemains,
  defaultReportCucina,
  defaultShift,
  defaultStaff,
  ReportCucinaType,
  schemaReportCucina,
} from "./schema";
import { SendResetButton } from "@/features/ui/SendResetButton";
import { useEmployeeSqlData } from "@/hooks/use-employee-sql";
import { useEffect, useMemo } from "react";
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
  PRODUCTS_STAFF,
  REASON,
  REMAINS_PRODUCTS,
  SELECT_TIME,
} from "./constants";
import { RenderTableByFields } from "./RenderTableByFields";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useLocalStorageForm } from "@/hooks/use-local-storage";

import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { CUCINA, useAbility } from "@/providers/AbilityProvider";
import { useSession } from "next-auth/react";

export default function DailyReportForm() {
  const t = useTranslations("Navigation");

  const STORAGE_KEY = "report-cucina";
  const { isObserver, isCucina } = useAbility();
  const session = useSession();

  const { employees } = useEmployeeSqlData();

  const selectedEmployees = useMemo(
    () =>
      employees
        .filter((emp) => CUCINA_EMPLOYEES.includes(emp.position))
        .map((emp) => emp.name),
    [employees]
  );

  const {
    getValue,
    setValue: setLocalStorage,
    removeValue,
  } = useLocalStorageForm(STORAGE_KEY);

  const form = useForm<ReportCucinaType>({
    defaultValues: {
      ...(defaultReportCucina as ReportCucinaType),
      ...(getValue() as ReportCucinaType),
    },
    resolver: yupResolver(schemaReportCucina),
  });

  const handleSubmit: SubmitHandler<ReportCucinaType> = async (data) => {
    const invalidShift = data.shifts.some((shift) => !shift.employees?.trim());
    if (invalidShift) {
      toast.error("Заполните всех сотрудников в сменах!");
      return;
    }

    try {
      const response = await fetch("/api/report-cucina/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Ошибка при отправке формы");
      }

      toast.success("Форма успешно отправлена!");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Произошла ошибка");
    }
  };
  //supabase
  const watchAllFields = form.watch();
  useEffect(() => {
    const sendDataToApi = async () => {
      const localData = localStorage.getItem(STORAGE_KEY);
      if (!localData) return;
      if (!isCucina) return;

      try {
        const res = await fetch("/api/report-cucina-realtime", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_email: session?.data?.user?.email,
            form_data: JSON.parse(localData),
          }),
        });

        const result = await res.json();
        if (result.error) {
          console.error("Sync error:", result.error);
        }
      } catch (err) {
        console.error("Request error:", err);
      }
    };

    const timeout = setTimeout(sendDataToApi, 500);
    return () => clearTimeout(timeout);
  }, [watchAllFields]);

  const fetchSupabaseData = async () => {
    try {
      const res = await fetch("/api/report-cucina-realtime");
      const allData = await res.json();

      const userData = allData.find(
        (item: any) => item.user_email === CUCINA[0]
      );

      if (userData?.form_data) {
        form.reset({
          ...(userData.form_data as ReportCucinaType),
        });

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            ...userData?.form_data,
          })
        );
      }
    } catch (err) {
      console.error("Error fetching Supabase data:", err);
    }
  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      setLocalStorage(value as ReportCucinaType);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, setLocalStorage]);

  const resetForm = () => {
    form.reset(defaultReportCucina);

    removeValue();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="w-full md:px-10 md:mx-auto md:max-w-5xl">
          <DatePickerInput fieldName="date" />

          {selectedEmployees.length > 0 && (
            <RenderTableByFields
              name="shifts"
              form={form}
              placeHolder={{
                field1: "employees",
                field2: "time",
                field3: "over",
              }}
              dataArrayField1={selectedEmployees}
              dataArrayField2={SELECT_TIME}
              dataArrayField3={OVER_HOURS}
              defaultValue={defaultShift}
            />
          )}

          <RenderTableByFields
            name="remains"
            form={form}
            placeHolder={{
              field1: "product",
              field2: "portions",
              field3: "weight",
            }}
            dataArrayField1={REMAINS_PRODUCTS}
            defaultValue={defaultRemains}
          />

          <RenderTableByFields
            name="preparedSalads"
            form={form}
            placeHolder={{
              field1: "product",
              field2: "portions",
              field3: "weight",
              field4: "time",
            }}
            dataArrayField1={[...PRODUCTS_GARNISH, ...PRODUCTS_SALAD]}
            defaultValue={defaultProductsSalad}
          />

          <RenderTableByFields
            name="preparedSeconds"
            form={form}
            placeHolder={{
              field1: "product",
              field2: "portions",
              field3: "weight",
              field4: "time",
            }}
            dataArrayField1={PRODUCTS_MEAT}
            defaultValue={defaultProductsSeconds}
          />

          <RenderTableByFields
            name="preparedDesserts"
            form={form}
            placeHolder={{
              field1: "product",
              field2: "portions",
              field3: "weight",
              field4: "time",
            }}
            dataArrayField1={PRODUCTS_DESSERT}
            defaultValue={defaultProductsDesserts}
          />

          <RenderTableByFields
            name="cutting"
            form={form}
            placeHolder={{
              field1: "product",
              field2: "portions",
              field3: "weight",
              field4: "time",
            }}
            dataArrayField1={[...PRODUCTS_SEMIFINISHED, ...PRODUCTS_MEAT_FISH]}
            defaultValue={defaultProductsCutting}
          />

          <RenderTableByFields
            name="staff"
            form={form}
            placeHolder={{
              field1: "product",
              field2: "portions",
              field3: "weight",
              field4: "time",
            }}
            dataArrayField1={PRODUCTS_STAFF}
            defaultValue={defaultStaff}
          />

          <RenderTableByFields
            name="movement"
            form={form}
            placeHolder={{
              field1: "nameOutside",
              field2: "nameInside",
              field3: "weight",
            }}
            dataArrayField1={PRODUCTS_INGREDIENTS}
            dataArrayField2={PRODUCTS_INGREDIENTS}
            defaultValue={defaultStaff}
          />

          <RenderTableByFields
            name="writeOff"
            form={form}
            placeHolder={{
              field1: "product",
              field2: "weight",
              field3: "reason",
            }}
            dataArrayField1={PRODUCTS_INGREDIENTS}
            dataArrayField3={REASON}
            defaultValue={defaultProductsSeconds}
          />
          <Label className="font-semibold py-4 text-md text-blue-600">
            {t("notes")}
          </Label>
          <Textarea
            placeholder="Введите текст..."
            {...form.register("notes")}
          />
          <SendResetButton
            resetForm={resetForm}
            fetchData={fetchSupabaseData}
          />
        </div>
      </form>
    </Form>
  );
}
