"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { BREAK_LIST_ENDPOINT } from "@/constants/endpoint-tag";
import { FormWrapper } from "@/components/wrapper/FormWrapper";
import { BreakTable } from "./BreakTable";
import { createBreakList } from "@/app/actions/archive/breakListAction";
import { toast } from "sonner";
import { BreakFormData, breakSchema, defaultValuesBrake } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocalStorageForm } from "@/hooks/useLocalStorageForm";
import { LoadingSkeletonBreak } from "../break-remarks/LoadingSkeleton";

export function BreakForm() {
  // form
  const form = useForm<BreakFormData>({
    resolver: yupResolver(breakSchema),
    defaultValues: defaultValuesBrake,
  });
  // localstorage
  const { isLoaded, resetForm } = useLocalStorageForm(
    form,
    BREAK_LIST_ENDPOINT
  );
  // submit
  const onSubmit: SubmitHandler<BreakFormData> = async (data) => {
    if (!data.date) {
      toast.error("Дата не выбрана");
      return;
    }
    try {
      await createBreakList(data);
      toast.success("Брейк-лист успешно сохранён !");
      resetForm({ ...defaultValuesBrake, date: new Date() });
    } catch (e) {
      toast.error("Ошибка при сохранении брейк-листа");
    }
  };
  // set data

  if (!isLoaded) return <LoadingSkeletonBreak />;

  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <BreakTable />
    </FormWrapper>
  );
}
