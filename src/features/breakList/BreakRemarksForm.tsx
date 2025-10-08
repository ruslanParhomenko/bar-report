"use client";
import { useEffect } from "react";
import {
  useForm,
  SubmitHandler,
  useWatch,
  useFieldArray,
} from "react-hook-form";
import toast from "react-hot-toast";

import { useAbility } from "@/providers/AbilityProvider";
import { useDataSupaBase } from "@/hooks/useRealTimeData";
import { useApi } from "@/hooks/useApi";

import { Form } from "../../components/ui/form";
import DatePickerInput from "@/components/inputs/DatePickerInput";
import { SendResetButton } from "../../components/buttons/SendResetButton";
import { FetchDataButton } from "../../components/buttons/FetchDataButton";
import { BreakListTable } from "./BreakTable";
import {
  BREAK_LIST_ENDPOINT,
  BREAK_LIST_REALTIME_ENDPOINT,
  REMARKS_ENDPOINT,
} from "@/constants/endpoint-tag";
import { BreakRemarksData, dataSchema, defaultValuesBrakeList } from "./schema";
import RemarksTable from "./RemarksTable";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEmployees } from "@/providers/GoogleSheetsProvider";

const BreakList = () => {
  const { employees } = useEmployees();
  const LOCAL_STORAGE_KEY = BREAK_LIST_ENDPOINT;

  const { isBar, isCucina, isObserver } = useAbility();
  const isDisabled = isObserver || isCucina || isBar;

  //create
  const { createMutation: createBreakeList } = useApi<BreakRemarksData>({
    endpoint: BREAK_LIST_ENDPOINT,
    queryKey: BREAK_LIST_ENDPOINT,
    fetchInit: false,
  });

  const { createMutation: createRemarks } = useApi<
    Omit<BreakRemarksData, "rows">
  >({
    endpoint: REMARKS_ENDPOINT,
    queryKey: REMARKS_ENDPOINT,
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
  const form = useForm<BreakRemarksData>({
    resolver: yupResolver(dataSchema),
    defaultValues: parsedSavedData || defaultValuesBrakeList,
  });
  const watchAllFields = useWatch({
    control: form.control,
  });

  const remarks = useFieldArray({
    control: form.control,
    name: "remarks",
  });

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

  const handleSubmit: SubmitHandler<BreakRemarksData> = async (data) => {
    console.log("data", data);
    if (!data.date) {
      toast.error("Дата не выбрана");
      return;
    }
    try {
      await Promise.all([
        createBreakeList.mutateAsync({
          date: new Date(data.date),
          rows: data.rows,
          remarks: [],
        }),
        createRemarks.mutateAsync({
          date: new Date(data.date),
          remarks: data.remarks,
        }),
      ]);
      toast.success("Брейк-лист успешно сохранён !");
      resetForm();
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col md:min-h-[95vh]"
      >
        <div className="flex items-center justify-between pb-5">
          <DatePickerInput fieldName="date" />
          <FetchDataButton
            fetchData={fetchSupaBaseData}
            isDisabled={isDisabled}
          />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <BreakListTable employees={employees || []} />
          <RemarksTable fields={remarks} employees={employees || []} />
        </div>

        <SendResetButton resetForm={resetForm} reset={true} />
      </form>
    </Form>
  );
};

export default BreakList;
