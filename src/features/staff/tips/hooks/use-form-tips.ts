"use client";

import { createTips } from "@/features/staff/tips/actions/create-tips";
import {
  defaultTipsForm,
  TipsForm,
  tipsSchema,
} from "@/features/staff/tips/model/schema";
import { useMonthDays } from "@/hooks/use-month-days";
import { useEdit } from "@/providers/edit-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function useFormTips() {
  const { month, year } = useMonthDays();
  const { setIsEdit } = useEdit();

  const form = useForm<TipsForm>({
    resolver: zodResolver(tipsSchema),
    defaultValues: defaultTipsForm,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit: SubmitHandler<TipsForm> = async (data) => {
    const formattedData = {
      tipsData: data,
      year,
      month,
    };
    try {
      await createTips(formattedData);

      toast.success("Форма сохранена успешно!");
    } catch (error) {
      toast.error("Произошла ошибка при сохранении формы");
    }

    setIsEdit(false);
  };
  return {
    form,
    onSubmit,
  };
}
