"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  cashVerifyDefault,
  defaultValuesReportBar,
  expensesDefault,
  inventoryDefault,
  productTransferDefault,
} from "./report/schema";

import { zodResolver } from "@hookform/resolvers/zod";

import { createReportBar } from "@/app/actions/report-bar/report-bar-action";
import { Activity, useEffect } from "react";
import { useAbility } from "@/providers/ability-provider";
import { defaultRemarksValue } from "@/features/bar/penalty/schema";
import {
  BreakFormData,
  defaultValuesBreak,
} from "@/features/bar/break-form/schema";
import { createRemarks } from "@/app/actions/remarks/remarks-action";
import { createBreakList } from "@/app/actions/break/break-action";
import { BarFormValues, barSchema, defaultValuesBarForm } from "./schema";
import { MONTHS } from "@/utils/get-month-days";
import { useSearchParams } from "next/navigation";
import FormInput from "@/components/wrapper/form";
import { useEmployees } from "@/providers/employees-provider";
import DatePickerInput from "@/components/inputs/date-input";
import { parseISO } from "date-fns";

import dynamic from "next/dynamic";

const ReportBarTable = dynamic(() => import("./report/report-bar-table"), {
  ssr: false,
});
const BreakTable = dynamic(
  () => import("@/features/bar/break-form/break-table"),
);
const PenaltyTable = dynamic(
  () => import("@/features/bar/penalty/penalty-table"),
);

const BAR_EMPLOYEES = ["waiters", "barmen"];

export default function BarForm({
  realtimeData,
  dataBreakList,
}: {
  realtimeData: BarFormValues;
  dataBreakList: BreakFormData;
}) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const { isBar, isAdmin } = useAbility();
  const isDisabled = !(isAdmin || isBar);

  const employeesName = useEmployees()
    .filter((emp) => BAR_EMPLOYEES.includes(emp.role))
    .map((e) => e.name);

  const form = useForm<BarFormValues>({
    defaultValues: defaultValuesBarForm,
    resolver: zodResolver(barSchema),
  });

  const onSubmit: SubmitHandler<BarFormValues> = async (data) => {
    const { date, report, penalty, breakForm } = data;

    const dateValue = typeof date === "string" ? parseISO(date) : date;
    const month = MONTHS[dateValue.getMonth()];
    const year = dateValue.getFullYear().toString();
    const day = String(dateValue.getDate());

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
      breakForm: defaultValuesBreak(dataBreakList.rows),
    });

    toast.success("Бар отчет успешно сохранён !");
  };

  useEffect(() => {
    if (!realtimeData) return;

    form.reset({
      date: realtimeData.date ? new Date(realtimeData.date) : new Date(),
      report: realtimeData.report ?? defaultValuesReportBar,
      penalty: realtimeData.penalty ?? defaultRemarksValue,
      breakForm:
        realtimeData.breakForm ?? defaultValuesBreak(dataBreakList.rows),
    });
  }, [realtimeData, form]);

  return (
    <FormInput
      form={form}
      onSubmit={onSubmit}
      onError={() => {
        toast.error("Заполните обязательные красные поля");
      }}
      disabled={isDisabled}
      className="px-1"
    >
      <DatePickerInput
        fieldName="date"
        className="text-sm text-rd h-6"
        // disabled
      />
      <Activity mode={tab === "report" ? "visible" : "hidden"}>
        <ReportBarTable isDisabled={isDisabled} />
      </Activity>
      <Activity mode={tab === "break" ? "visible" : "hidden"}>
        <BreakTable isDisabled={isDisabled} employeesName={employeesName} />
        <PenaltyTable isDisabled={isDisabled} />
      </Activity>
    </FormInput>
  );
}
