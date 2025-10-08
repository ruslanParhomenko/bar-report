"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import DatePickerInput from "@/components/inputs/DatePickerInput";
import { Form } from "@/components/ui/form";
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
import { useEffect } from "react";
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
import { useLocalStorageForm } from "@/hooks/use-local-storage";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { useAbility } from "@/providers/AbilityProvider";
import { FetchDataButton } from "@/components/buttons/FetchDataButton";
import RenderTableCucina from "./RenderTableByFields";
import { useEmployees } from "@/providers/GoogleSheetsProvider";
import { useApi } from "@/hooks/useApi";
import { DailyReportCucina } from "@/generated/prisma";
import {
  REPORT_CUCINA_ENDPOINT,
  REPORT_CUCINA_REALTIME_ENDPOINT,
} from "@/constants/endpoint-tag";
import { useDataSupaBase } from "@/hooks/useRealTimeData";
import dynamic from "next/dynamic";

function ReportCucina() {
  const t = useTranslations("Home");
  const LOCAL_STORAGE_KEY = REPORT_CUCINA_ENDPOINT;

  const { isCucina, isObserver, isUser, isAdmin, isBar } = useAbility();
  const isDisabled = isObserver || isCucina || isBar;

  //employees
  const { employees } = useEmployees();
  const selectedEmployees = employees
    .filter((emp) => CUCINA_EMPLOYEES.includes(emp.position))
    .map((emp) => emp.name);

  //create
  const { createMutation } = useApi<DailyReportCucina>({
    endpoint: REPORT_CUCINA_ENDPOINT,
    queryKey: REPORT_CUCINA_ENDPOINT,
    fetchInit: false,
  });

  //realtime
  const { sendRealTime, fetchRealTime } = useDataSupaBase({
    localStorageKey: LOCAL_STORAGE_KEY,
    apiKey: REPORT_CUCINA_REALTIME_ENDPOINT,
  });

  //localstorage
  const {
    getValue,
    setValue: setLocalStorage,
    removeValue,
  } = useLocalStorageForm(LOCAL_STORAGE_KEY);

  //form
  const form = useForm<ReportCucinaType>({
    defaultValues: {
      ...(defaultReportCucina as ReportCucinaType),
      ...(getValue() as ReportCucinaType),
    },
    resolver: yupResolver(schemaReportCucina),
  });

  const watchAllFields = form.watch();

  //set locale supaBase
  useEffect(() => {
    if (!watchAllFields) return;
    setLocalStorage(watchAllFields as ReportCucinaType);
    if (!isCucina) return;
    const timeout = setTimeout(() => {
      sendRealTime();
    }, 1000);
    return () => clearTimeout(timeout);
  }, [watchAllFields]);
  //reset
  const resetForm = () => {
    form.reset(defaultReportCucina);
    // removeValue();
  };
  const value = getValue() as ReportCucinaType;

  const handleSubmit: SubmitHandler<ReportCucinaType> = (data) => {
    const invalidShift = data.shifts.some((shift) => !shift.employees?.trim());
    if (invalidShift) {
      toast.error("Заполните всех сотрудников в сменах!");
      return;
    }

    try {
      createMutation.mutate({
        ...data,
        date: new Date(data.date),
      });

      form.reset(defaultReportCucina);

      toast.success("Форма успешно отправлена!");
    } catch (error: any) {
      toast.error(error?.message || "Произошла ошибка");
    }
  };

  //fetch realtime
  const fetchSupaBaseData = async () => {
    const data = await fetchRealTime();
    const resetData = data?.cucina || [];
    if (resetData) {
      form.reset(resetData);
      setLocalStorage(resetData as ReportCucinaType);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="w-full md:px-10 md:mx-auto md:max-w-5xl">
          <div className="flex items-center gap-4 justify-between">
            <DatePickerInput fieldName="date" />
            <FetchDataButton
              fetchData={fetchSupaBaseData}
              isDisabled={isDisabled}
            />
          </div>

          {selectedEmployees.length > 0 && (
            <RenderTableCucina
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
          <Label className="font-semibold py-4 text-md text-bl">
            {t("notes")}
          </Label>
          <Textarea
            placeholder="notes ..."
            {...form.register("notes")}
            disabled={isObserver}
          />
          <SendResetButton resetForm={resetForm} reset={isAdmin} />
        </div>
      </form>
    </Form>
  );
}

const ReportCucinaForm = dynamic(() => Promise.resolve(ReportCucina), {
  ssr: false,
});

export default ReportCucinaForm;
