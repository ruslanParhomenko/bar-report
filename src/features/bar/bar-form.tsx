"use client";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import {
  cashVerifyDefault,
  defaultValuesReportBar,
  expensesDefault,
  inventoryDefault,
  productTransferDefault,
} from "./report/schema";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  createReportBar,
  realtimeReportBar,
} from "@/app/actions/report-bar/report-bar-action";
import { Activity, useEffect } from "react";
import { useAbility } from "@/providers/ability-provider";
import ReportBarTable from "./report/report-bar-table";
import BreakTable from "@/features/bar/break-form/break-table";
import PenaltyTable from "@/features/bar/penalty/penalty-table";
import { defaultRemarksValue } from "@/features/bar/penalty/schema";
import { defaultValuesBreak } from "@/features/bar/break-form/schema";
import { createRemarks } from "@/app/actions/remarks/remarks-action";
import { createBreakList } from "@/app/actions/break/break-action";
import { useRealtimeSave } from "@/hooks/use-realtime-save";
import { BarFormValues, barSchema, defaultValuesBarForm } from "./schema";
import { MONTHS } from "@/utils/get-month-days";
import { useSearchParams } from "next/navigation";
import FormInput from "@/components/wrapper/form";
import { useEmployees } from "@/providers/employees-provider";

const BAR_EMPLOYEES = ["waiters", "barmen"];

export default function BarForm({
  realtimeData,
}: {
  realtimeData?: BarFormValues;
}) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const { isBar, isAdmin } = useAbility();
  const isDisabled = !(isAdmin || isBar);

  const employeesName = useEmployees()
    .filter((emp) => BAR_EMPLOYEES.includes(emp.role))
    .map((e) => e.name);

  const form = useForm<BarFormValues>({
    defaultValues: realtimeData ?? defaultValuesBarForm,
    resolver: zodResolver(barSchema),
  });

  const values = useWatch({ control: form.control }) as BarFormValues;

  console.log("values", values);

  useRealtimeSave(values, isBar, async (data) => {
    if (!data) return;

    await realtimeReportBar(data);
    toast.info("сохранение данных…", { duration: 2000 });
  });
  //submit
  const onSubmit: SubmitHandler<BarFormValues> = async (data) => {
    const { date, report, penalty, breakForm } = data;
    const dateValue = new Date(date);
    const month = MONTHS[dateValue.getMonth()];
    const year = dateValue.getFullYear().toString();
    const day = dateValue.getDate().toLocaleString();
    const uniqueKey = `${year}-${month}`;
    const formateReportData = {
      ...report,
      tobacco: report.tobacco?.map((item) => ({
        ...item,
        stock: item.stock,
        incoming: item.incoming ?? "0",
        outgoing: item.outgoing ?? "0",
        finalStock: item.stock + +item.incoming - +item.outgoing,
      })),
      cashVerify: report.cashVerify?.filter((item) => item.value),
      expenses: report.expenses?.filter((item) => item.name),
      productTransfer: report.productTransfer?.filter((item) => item.name),
      inventory: report.inventory?.filter((item) => item.quantity),
      notes: report.notes,
    };

    const formattedBreakData = {
      day,
      month,
      year,
      uniqueKey,
      rows: breakForm.rows,
    };
    const formattedPenaltyData = {
      remarks: penalty.remarks,
      uniqueKey: uniqueKey,
      month: month,
      year: year,
      day: day,
    };

    await createReportBar(uniqueKey, year, month, {
      day,
      report: formateReportData,
    });
    await createBreakList(formattedBreakData);
    await createRemarks(uniqueKey, formattedPenaltyData);

    const updatedTobacco = report.tobacco?.map((item) => {
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

    form.reset({
      date: new Date(),
      report: updatedData,
      penalty: defaultRemarksValue,
      breakForm: defaultValuesBreak,
    });

    toast.success("Бар отчет успешно сохранён !");
  };

  useEffect(() => {
    if (!realtimeData) return;

    form.reset({
      date: realtimeData.date ? new Date(realtimeData.date) : new Date(),
      report: realtimeData.report ?? defaultValuesReportBar,
      penalty: realtimeData.penalty ?? defaultRemarksValue,
      breakForm: realtimeData.breakForm ?? defaultValuesBreak,
    });
  }, [realtimeData, form]);

  return (
    <FormInput
      form={form}
      onSubmit={onSubmit}
      withDate={true}
      disabled={isDisabled}
      className="px-1"
    >
      <Activity mode={tab === "break" ? "visible" : "hidden"}>
        <BreakTable isDisabled={isDisabled} employeesName={employeesName} />
        <PenaltyTable isDisabled={isDisabled} />
      </Activity>

      <Activity mode={tab === "report" ? "visible" : "hidden"}>
        <ReportBarTable isDisabled={isDisabled} />
      </Activity>
    </FormInput>
  );
}
