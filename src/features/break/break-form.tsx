"use client";
import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { BreakFormData, breakSchema, defaultValuesBrake } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  realtimeBreakList,
  createBreakList,
} from "@/app/actions/break/break-action";
import { toast } from "sonner";
import { MONTHS } from "@/utils/getMonthDays";
import { FormWrapper } from "@/components/wrapper/form-wrapper";
import { Table } from "@/components/ui/table";
import BreakTableHeader from "./break-header";
import BreakTableBody from "./break-body";

export default function BreakForm({
  employeesName,
  defaultValues,
}: {
  employeesName: string[];
  defaultValues?: BreakFormData;
}) {
  const form = useForm<BreakFormData>({
    resolver: zodResolver(breakSchema),
    defaultValues: defaultValues ?? defaultValuesBrake,
  });

  useEffect(() => {
    const timeoutRef = { current: null as NodeJS.Timeout | null };

    const subscription = form.watch((value) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        realtimeBreakList(value as BreakFormData).catch(console.error);
      }, 5000);
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [form]);

  const onSubmit: SubmitHandler<BreakFormData> = async (data) => {
    const day = new Date(data.date).getDate().toLocaleString();
    const month = MONTHS[new Date(data.date).getMonth()];
    const year = new Date(data.date).getFullYear().toString();
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
      form.reset({ ...defaultValuesBrake, date: new Date().toISOString() });
    } catch (e) {
      toast.error("Ошибка при сохранении брейк-листа");
    }
  };

  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <Table className="md:table-fixed mt-6">
        <BreakTableHeader />
        <BreakTableBody employeesName={employeesName} />
      </Table>
    </FormWrapper>
  );
}
