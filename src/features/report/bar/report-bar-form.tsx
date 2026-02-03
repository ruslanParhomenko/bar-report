"use client";
import { Resolver, useForm, useWatch } from "react-hook-form";
import DatePickerInput from "@/components/inputs/DatePickerInput";
import { toast } from "sonner";
import {
  cashVerifyDefault,
  defaultValuesReportBar,
  expensesDefault,
  inventoryDefault,
  productTransferDefault,
  ReportBarFormValues,
  reportBarSchema,
} from "./schema";
import TableTobacco from "./tobacco-table";
import TableExpenses from "./expenses-table";
import TableCashVerify from "./cash-table";
import TableProductsTransfer from "./transfer-table";
import { Textarea } from "@/components/ui/textarea";
import { TableInventory } from "./inventory-table";
import { FormWrapper } from "@/components/wrapper/form-wrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { MONTHS } from "@/utils/getMonthDays";
import {
  createReportBar,
  realtimeReportBar,
} from "@/app/actions/report-bar/report-bar-action";
import { useEffect } from "react";
import { useAbility } from "@/providers/AbilityProvider";

export default function ReportBarForm({
  realtimeData,
}: {
  realtimeData?: ReportBarFormValues;
}) {
  const { isBar, isAdmin } = useAbility();

  //form
  const form = useForm<ReportBarFormValues>({
    defaultValues: realtimeData ? realtimeData : defaultValuesReportBar,
    resolver: zodResolver(reportBarSchema) as Resolver<ReportBarFormValues>,
  });

  const reportValues = useWatch({
    control: form.control,
  });

  useEffect(() => {
    if (!isBar) return;
    const timeoutRef = { current: null as NodeJS.Timeout | null };

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const data = form.getValues() as ReportBarFormValues;

      realtimeReportBar(data).catch(console.error);
      toast.info("Автосохранение отчёта ...", { duration: 3000 });
    }, 6000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [reportValues]);
  //submit
  const onSubmit = async (data: ReportBarFormValues) => {
    const { date, ...rest } = data;
    const dateValue = new Date(date);
    const month = MONTHS[dateValue.getMonth()];
    const year = dateValue.getFullYear().toString();
    const day = dateValue.getDate().toLocaleString();
    const uniqueKey = `${year}-${month}`;
    const formateData = {
      ...rest,
      tobacco: data.tobacco?.map((item) => ({
        ...item,
        stock: item.stock,
        incoming: item.incoming ?? "0",
        outgoing: item.outgoing ?? "0",
        finalStock: item.stock + +item.incoming - +item.outgoing,
      })),
      cashVerify: data.cashVerify?.filter((item) => item.value),
      expenses: data.expenses?.filter((item) => item.name),
      productTransfer: data.productTransfer?.filter((item) => item.name),
      inventory: data.inventory?.filter((item) => item.quantity),
      notes: data.notes,
    };

    await createReportBar(uniqueKey, year, month, { day, report: formateData });

    const updatedTobacco = data?.tobacco?.map((item) => {
      const finalStock =
        item.stock + Number(item.incoming || 0) - Number(item.outgoing || 0);

      return {
        ...item,
        stock: finalStock,
        incoming: "",
        outgoing: "",
      };
    });

    const updatedData = {
      ...data,
      date: new Date(),
      tobacco: updatedTobacco,
      cashVerify: cashVerifyDefault,
      expenses: expensesDefault,
      productTransfer: productTransferDefault,
      inventory: inventoryDefault,
      notes: "",
    };

    await realtimeReportBar(updatedData).catch(console.error);
    form.reset(updatedData);

    toast.success("Бар отчет успешно сохранён !");
  };

  return (
    <FormWrapper form={form} onSubmit={onSubmit} className="gap-6">
      <div className="flex w-full justify-end">
        <DatePickerInput
          fieldName="date"
          className="md:w-30 h-8 text-sm w-full text-rd"
          disabled={!isAdmin && !isBar}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[22%_20%_26%_20%] xl:justify-between">
        <TableTobacco />
        <TableExpenses />
        <TableProductsTransfer />
        <TableInventory />
      </div>
      <Textarea
        placeholder="notes ..."
        {...form.register("notes")}
        className="resize-none"
      />

      <TableCashVerify />
    </FormWrapper>
  );
}
