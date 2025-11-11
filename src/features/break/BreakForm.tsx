"use client";

import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { BREAK_LIST_ENDPOINT } from "@/constants/endpoint-tag";
import { FormWrapper } from "@/components/wrapper/FormWrapper";
import { BreakTable } from "./BreakTable";
import { createBreakList } from "@/app/actions/archive/breakListAction";
import { toast } from "sonner";
import { BreakFormData, breakSchema, defaultValuesBrake } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";

export function BreakForm() {
  const LOCAL_STORAGE_KEY = BREAK_LIST_ENDPOINT;

  //localstorage
  const savedData =
    typeof window !== "undefined"
      ? localStorage.getItem(LOCAL_STORAGE_KEY)
      : null;
  const parsedSavedData = savedData ? JSON.parse(savedData) : null;

  //form
  const form = useForm<BreakFormData>({
    resolver: yupResolver(breakSchema),
    defaultValues: parsedSavedData || defaultValuesBrake,
  });
  const watchAllFields = useWatch({
    control: form.control,
  });

  //submit

  const onSubmit: SubmitHandler<BreakFormData> = async (data) => {
    if (!data.date) {
      toast.error("Дата не выбрана");
      return;
    }
    try {
      await createBreakList(data);
      toast.success("Брейк-лист успешно сохранён !");
      resetForm();
    } catch (e) {
      toast.error("Ошибка при сохранении брейк-листа");
    }
  };

  //reset
  const resetForm = () => {
    form.reset({ ...defaultValuesBrake, date: new Date() });
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  //set local
  useEffect(() => {
    if (!watchAllFields) return;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(watchAllFields));
  }, [watchAllFields]);

  //set data
  const dataRows = form.getValues("rows") ?? [];

  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <BreakTable dataRows={dataRows} />
    </FormWrapper>
  );
}
