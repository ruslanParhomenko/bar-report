"use client";
import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

import { useAbility } from "@/providers/AbilityProvider";
import { useDataSupaBase } from "@/hooks/useRealTimeData";
import { useApi } from "@/hooks/useApi";

import { Form } from "../../components/ui/form";
import DatePickerInput from "@/components/inputs/DatePickerInput";
import { SendResetButton } from "../../components/buttons/SendResetButton";
import { FetchDataButton } from "../../components/buttons/FetchDataButton";
import { BreakListTable } from "./BreakListTable";

import { BreakeList } from "@/generated/prisma";
import {
  BREAK_LIST_ENDPOINT,
  BREAK_LIST_REALTIME_ENDPOINT,
} from "@/constants/endpoint-tag";
import { BreakListFormValues, defaultValuesBrakeList } from "./schema";

const BreakList = () => {
  const LOCAL_STORAGE_KEY = BREAK_LIST_ENDPOINT;

  const { isBar, isCucina, isUser, isAdmin, isObserver } = useAbility();
  const isDisabled = isObserver || isCucina || isBar;

  //create
  const { createMutation } = useApi<BreakeList>({
    endpoint: BREAK_LIST_ENDPOINT,
    queryKey: BREAK_LIST_ENDPOINT,
    fetchInit: false,
  });

  //realtime
  const { sendRealTime, fetchRealTime } = useDataSupaBase({
    localStorageKey: LOCAL_STORAGE_KEY,
    apiKey: BREAK_LIST_REALTIME_ENDPOINT,
  });

  //localstorage
  const savedData =
    typeof window !== "undefined"
      ? localStorage.getItem(LOCAL_STORAGE_KEY)
      : null;
  const parsedSavedData = savedData ? JSON.parse(savedData) : null;

  //form
  const form = useForm<BreakListFormValues>({
    defaultValues: parsedSavedData || defaultValuesBrakeList,
  });
  const watchAllFields = form.watch();

  //set local supaBase
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
    console.log("Submitting data:", data);
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

  //reset
  const resetForm = () => {
    form.reset({ ...defaultValuesBrakeList, date: new Date() });
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  //fetch realtime
  const fetchSupaBaseData = async () => {
    const data = await fetchRealTime();
    const resetData = data?.bar || [];

    if (resetData) {
      form.reset({
        ...resetData,
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(resetData));
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
          <div className="flex items-center gap-4 justify-between">
            <DatePickerInput fieldName="date" />
            <FetchDataButton
              fetchData={fetchSupaBaseData}
              isDisabled={isDisabled}
            />
          </div>
          <BreakListTable />
          <SendResetButton resetForm={resetForm} />
        </form>
      </Form>
    </div>
  );
};

export default BreakList;
