"use client";
import { Form } from "@/components/ui/form";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useEffect, useRef } from "react";
import { formatNowData } from "@/utils/formatNow";
import {
  defaultStopListSchema,
  stopListSchema,
  StopListSchemaType,
} from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { StopListTable } from "./StopListTable";
import { STOP_LIST_REALTIME } from "@/constants/endpoint-tag";
import { useLocalStorageForm } from "@/hooks/use-local-storage";
import { useDataSupabase } from "@/hooks/useRealTimeData";
import { useAbility } from "@/providers/AbilityProvider";
import { FetchDataButton } from "@/components/buttons/FetchDataButton";

export default function StopListForm() {
  const { isBar, isCucina } = useAbility();
  const LOCAL_STORAGE_KEY = STOP_LIST_REALTIME;
  const { getValue, setValue: setLocalStorage } =
    useLocalStorageForm<StopListSchemaType>(LOCAL_STORAGE_KEY);

  const { sendRealTime, fetchRealTime } = useDataSupabase({
    localStorageKey: LOCAL_STORAGE_KEY,
    apiKey: STOP_LIST_REALTIME,
    user: "bar",
  });

  const form = useForm<StopListSchemaType>({
    resolver: yupResolver(stopListSchema),
    defaultValues: { ...defaultStopListSchema, ...getValue() },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      setLocalStorage(value as StopListSchemaType);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, setLocalStorage]);

  const stopListValues = useFieldArray({
    control: form.control,
    name: "stopList",
  });
  const stopListCucinaValues = useFieldArray({
    control: form.control,
    name: "stopListCucina",
  });

  const watchStopList = useWatch({ control: form.control, name: "stopList" });
  const watchStopListCucina = useWatch({
    control: form.control,
    name: "stopListCucina",
  });

  const syncedRows = useRef<Record<number, boolean>>({});

  // Автозаполнение даты
  useEffect(() => {
    watchStopList.forEach((item, idx) => {
      if (item?.product && !item.date) {
        const date = formatNowData();
        stopListValues.update(idx, {
          ...stopListValues.fields[idx],
          ...item,
          date,
        });
      }
      if (!isBar) return;
      if (!syncedRows.current[idx] && item.product && item.date) {
        sendRealTime();
        syncedRows.current[idx] = true;
      }
    });
  }, [watchStopList, stopListValues.fields.length]);

  // автозаполнение даты
  useEffect(() => {
    watchStopListCucina.forEach((item, idx) => {
      if (item?.product && !item.date) {
        const date = formatNowData();
        stopListCucinaValues.update(idx, {
          ...stopListCucinaValues.fields[idx],
          ...item,
          date,
        });
      }
      if (!isCucina) return;
      if (!syncedRows.current[idx] && item.product && item.date) {
        sendRealTime();
        syncedRows.current[idx] = true;
      }
    });
  }, [watchStopListCucina, stopListCucinaValues.fields.length]);

  // авто-сохранение при изменении формы
  const fetchSupabaseData = async () => {
    const data = await fetchRealTime();
    if (data) {
      form.reset(data);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    }
  };
  useEffect(() => {
    if (!isBar && !isCucina) return;
    const timeout = setTimeout(() => {
      fetchSupabaseData();
    }, 1000);
    return () => clearTimeout(timeout);
  }, [isBar, isCucina]);

  return (
    <Form {...form}>
      <form className="space-y-2">
        <div className="grid xl:grid-cols-2 gap-5 pb-5">
          <StopListTable formFields={stopListValues} nameTag="bar" />
          <StopListTable formFields={stopListCucinaValues} nameTag="cucina" />
        </div>
        <FetchDataButton fetchData={fetchSupabaseData} />
      </form>
    </Form>
  );
}
