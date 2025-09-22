"use client";
import { Resolver, SubmitHandler, useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocalStorageForm } from "@/hooks/use-local-storage";
import { useEffect } from "react";
import DatePickerInput from "@/components/inputs/DatePickerInput";
import { useAbility } from "@/providers/AbilityProvider";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import {
  cashVerifyDefault,
  defaultValuesReportBar,
  expensesDefault,
  LIST_TOBACCO,
  productTransferDefault,
  ReportBarFormValues,
  reportBarSchema,
  TobaccoSchemaType,
} from "./schema";
import TableTobacco from "./TableTobacco";
import TableExpenses from "./TableExpenses";
import TableCashVerify from "./TableCashVerify";
import { SendResetButton } from "@/components/buttons/SendResetButton";
import { FetchDataButton } from "@/components/buttons/FetchDataButton";
import { useApi } from "@/hooks/useApi";
import { DailyReport } from "@/generated/prisma";
import TableProductsTransfer from "./TableProductsTransfer";
import { Textarea } from "@/components/ui/textarea";

export function ReportBarForm() {
  const STORAGE_KEY = "report-bar";
  const { isBar, isAdmin, isUser, isCucina, isObserver } = useAbility();
  const isDisabled = isObserver || isCucina || isBar;
  const session = useSession();

  const { createMutation } = useApi<DailyReport>({
    endpoint: "report",
    queryKey: "report",
    fetchInit: false,
  });

  const {
    getValue,
    setValue: setLocalStorage,
    removeValue,
  } = useLocalStorageForm<ReportBarFormValues>(STORAGE_KEY);

  const form = useForm<ReportBarFormValues>({
    defaultValues: {
      ...defaultValuesReportBar,
      ...getValue(),
    },
    resolver: yupResolver(
      reportBarSchema
    ) as unknown as Resolver<ReportBarFormValues>,
  });
  useEffect(() => {
    const subscription = form.watch((value) => {
      setLocalStorage(value as ReportBarFormValues);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, setLocalStorage]);

  const resetForm = () => {
    const currentValues = form.getValues();
    const resetTobacco = currentValues?.tobacco?.map((item) => ({
      ...item,
      incoming: "",
      outgoing: "",
    }));

    form.reset({
      ...currentValues,
      date: new Date().toDateString(),
      tobacco: resetTobacco as TobaccoSchemaType,
      cashVerify: cashVerifyDefault,
      expenses: expensesDefault,
      productTransfer: productTransferDefault,
      notes: "",
    });

    removeValue();
  };
  const handleSubmit: SubmitHandler<ReportBarFormValues> = (data) => {
    const formateData = {
      ...data,
      date: new Date(data.date),
      tobacco: data.tobacco?.map((item) => ({
        ...item,
        stock: Number(item.stock || 0),
        incoming: Number(item.incoming || 0),
        outgoing: Number(item.outgoing || 0),
        finalStock: String(
          Number(item.stock || 0) +
            Number(item.incoming || 0) -
            Number(item.outgoing || 0)
        ),
      })),
      cashVerify: data.cashVerify?.filter((item) => item.value),
      expenses: data.expenses?.filter((item) => item.name),
      productTransfer: data.productTransfer?.filter((item) => item.name),
      notes: data.notes,
    };
    createMutation.mutate(formateData);

    const updatedTobacco = data?.tobacco?.map((item) => {
      const finalStock =
        Number(item.stock || 0) +
        Number(item.incoming ?? 0) -
        Number(item.outgoing ?? 0);

      return {
        ...item,
        stock: finalStock,
        incoming: 0,
        outgoing: 0,
      };
    });

    const updatedData: ReportBarFormValues = {
      ...data,
      date: new Date().toDateString(),
      tobacco: updatedTobacco as TobaccoSchemaType,
      cashVerify: cashVerifyDefault,
      expenses: expensesDefault,
      productTransfer: productTransferDefault,
    };

    form.reset(updatedData);
    toast.success("Бар отчет успешно сохранён !");
  };

  //supaBase
  const watchAllFields = form.watch();
  useEffect(() => {
    const sendDataToApi = async () => {
      const localData = localStorage.getItem(STORAGE_KEY);
      if (!localData) return;
      if (!isBar) return;

      try {
        const res = await fetch("/api/report-realtime", {
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

  const fetchSupaBaseData = async () => {
    try {
      const res = await fetch("/api/report-realtime");
      const allData = await res.json();

      const userData = allData.find(
        (item: any) => item.user_email === "cng.nv.rstrnt@gmail.com"
      );

      if (userData?.form_data) {
        const tobaccoWithLocalNames = userData.form_data.tobacco.map(
          (item: any, idx: number) => ({
            ...item,
            name: LIST_TOBACCO[idx] || "",
            stock: String(item.stock) || "0",
          })
        );

        form.reset({
          ...userData.form_data,
          date: userData.form_data.date,
          tobacco: tobaccoWithLocalNames,
          cashVerify: userData.form_data.cashVerify,
          expenses: userData.form_data.expenses,
        });

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            ...userData.form_data,
            tobacco: tobaccoWithLocalNames,
          })
        );
      }
    } catch (err) {
      console.error("Error fetching  data:", err);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="md:pl-2">
        <div className="flex items-center gap-4 justify-between ">
          <DatePickerInput fieldName="date" />
          {(isAdmin || isUser) && (
            <FetchDataButton
              fetchData={fetchSupaBaseData}
              isDisabled={isDisabled}
            />
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[32%_62%] md:gap-15  pt-4">
          <TableTobacco />
          <div>
            <div className="grid  md:grid-cols-[30%_60%] md:gap-10 px-1 pb-6">
              <TableExpenses />
              <TableProductsTransfer />
            </div>
            <div className="px-4 pr-12 ">
              <Textarea
                placeholder="notes ..."
                {...form.register("notes")}
                disabled={isObserver}
                className="resize-none"
              />
            </div>
          </div>
        </div>

        <TableCashVerify />
        <SendResetButton
          resetForm={resetForm}
          disabledReset={isAdmin && true}
        />
      </form>
    </Form>
  );
}
