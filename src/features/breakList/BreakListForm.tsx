"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { Form } from "../../components/ui/form";
import DatePickerInput from "@/components/inputs/DatePickerInput";
import { SendResetButton } from "../../components/buttons/SendResetButton";
import { FetchDataButton } from "../../components/buttons/FetchDataButton";
import { useApi } from "@/hooks/useApi";
import { BreakeList } from "@/generated/prisma";
import {
  BREAK_LIST_ENDPOINT,
  BREAK_LIST_REALTIME_ENDPOINT,
} from "@/constants/endpoint-tag";
import { BreakListTable } from "./BreakListTable";
import { useAbility } from "@/providers/AbilityProvider";
import { BreakListFormValues, defaultValuesBraekList } from "./schema";
import { useDataSupabase } from "@/hooks/useRealTimeData";

const BreakList = () => {
  const LOCAL_STORAGE_KEY = BREAK_LIST_ENDPOINT;
  const { isBar } = useAbility();
  const { sendRealTime, fetchRealTime } = useDataSupabase({
    localStorageKey: LOCAL_STORAGE_KEY,
    apiKey: BREAK_LIST_REALTIME_ENDPOINT,
    user: "bar",
  });
  const { createMutation } = useApi<BreakeList>({
    endpoint: BREAK_LIST_ENDPOINT,
    queryKey: BREAK_LIST_ENDPOINT,
    fetchInit: false,
  });

  const savedData =
    typeof window !== "undefined"
      ? localStorage.getItem(LOCAL_STORAGE_KEY)
      : null;

  const parsedSavedData = savedData ? JSON.parse(savedData) : null;

  const form = useForm<BreakListFormValues>({
    defaultValues: parsedSavedData || defaultValuesBraekList,
  });
  const watchAllFields = form.watch();

  useEffect(() => {
    if (!watchAllFields) return;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(watchAllFields));
    if (!isBar) return;
    const timeout = setTimeout(() => {
      sendRealTime();
    }, 1000);
    return () => clearTimeout(timeout);
  }, [watchAllFields]);

  const handleSubmit: SubmitHandler<BreakListFormValues> = (data) => {
    if (!data.date) {
      toast.error("Дата не выбрана");
      return;
    }
    try {
      createMutation.mutate({
        ...data,
        date: new Date(data.date),
      });
      toast.success("Брейк-лист успешно сохранён !");
    } catch (e) {
      toast.error("Ошибка при сохранении брейк-листа");
    }
  };

  const resetForm = () => {
    form.reset(defaultValuesBraekList);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const fetchSupabaseData = async () => {
    const data = await fetchRealTime();
    if (data) {
      form.reset(data);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
          <div className="flex items-center gap-4 justify-between">
            <DatePickerInput fieldName="date" />
            <FetchDataButton fetchData={fetchSupabaseData} />
          </div>
          <BreakListTable />
          <SendResetButton resetForm={resetForm} />
        </form>
      </Form>
    </div>
  );
};

export default BreakList;
