"use client";
import { useEffect } from "react";
import {
  useForm,
  SubmitHandler,
  useWatch,
  useFieldArray,
} from "react-hook-form";

import { useAbility } from "@/providers/AbilityProvider";
import { Form } from "../../components/ui/form";
import DatePickerInput from "@/components/inputs/DatePickerInput";
import { SendResetButton } from "../../components/buttons/SendResetButton";
import { FetchDataButton } from "../../components/buttons/FetchDataButton";
import { BreakListTable } from "./BreakTable";
import { BREAK_LIST_ENDPOINT } from "@/constants/endpoint-tag";
import { BreakRemarksData, dataSchema, defaultValuesBrakeList } from "./schema";
import RemarksTable from "./RemarksTable";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEmployees } from "@/providers/EmployeesProvider";
import { toast } from "sonner";
import { createBreakList } from "@/app/actions/archive/breakListAction";
import { createRemarks } from "@/app/actions/archive/remarksAction";

const BreakList = () => {
  const employees = useEmployees();
  const LOCAL_STORAGE_KEY = BREAK_LIST_ENDPOINT;

  const { isBar, isCucina, isObserver } = useAbility();
  const isDisabled = isObserver || isCucina || isBar;

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
  }, [watchAllFields]);

  //submit

  const handleSubmit: SubmitHandler<BreakRemarksData> = async (data) => {
    if (!data.date) {
      toast.error("Дата не выбрана");
      return;
    }
    try {
      await Promise.all([createBreakList(data), createRemarks(data)]);
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col md:min-h-[95vh]"
      >
        <div className="flex items-center justify-between pb-5">
          <DatePickerInput fieldName="date" />
          <FetchDataButton isDisabled={isDisabled} />
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
