"use client";
import { useEffect } from "react";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { BreakFormData, breakSchema, defaultValuesBreak } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  realtimeBreakList,
  createBreakList,
} from "@/app/actions/break/break-action";
import { toast } from "sonner";
import { MONTHS } from "@/utils/getMonthDays";
import { FormWrapper } from "@/components/wrapper/form-wrapper";
import { useAbility } from "@/providers/AbilityProvider";
import BreakTable from "./break-table";

export default function BreakForm({
  defaultValues,
}: {
  defaultValues?: BreakFormData;
}) {
  const { isBar } = useAbility();

  const form = useForm<BreakFormData>({
    resolver: zodResolver(breakSchema),
    defaultValues: defaultValues
      ? {
          date: new Date(defaultValues.date),
          rows: defaultValues.rows,
        }
      : defaultValuesBreak,
  });

  const rowsUse = useWatch({
    control: form.control,
    name: "rows",
  });

  useEffect(() => {
    if (!isBar) return;
    const timeoutRef = { current: null as NodeJS.Timeout | null };

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const data = form.getValues() as BreakFormData;

      realtimeBreakList(data).catch(console.error);
    }, 6000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [rowsUse]);

  const onSubmit: SubmitHandler<BreakFormData> = async (data) => {
    const date = new Date(data.date);
    const day = date.getDate().toLocaleString();
    const month = MONTHS[date.getMonth()];
    const year = date.getFullYear().toString();
    const uniqueKey = `${year}-${month}`;

    const formattedData = {
      day,
      month,
      year,
      uniqueKey,
      rows: data.rows,
    };

    try {
      await createBreakList(formattedData);
      toast.success("Брейк-лист успешно сохранён !");
      form.reset({ ...defaultValuesBreak, date: new Date() });
    } catch (e) {
      toast.error("Ошибка при сохранении брейк-листа");
    }
  };

  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <BreakTable />
    </FormWrapper>
  );
}
