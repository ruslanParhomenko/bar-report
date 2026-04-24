"use client";
import {
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { toast } from "sonner";
import {
  cashVerifyDefault,
  defaultValuesReportBar,
  expensesDefault,
  inventoryDefault,
  productTransferDefault,
} from "./report/schema";

import { zodResolver } from "@hookform/resolvers/zod";

import { createBreakList } from "@/app/actions/break/break-action";
import { createRemarks } from "@/app/actions/remarks/remarks-action";
import {
  createReportBar,
  realtimeReportBar,
} from "@/app/actions/report-bar/report-bar-action";
import FormInput from "@/components/wrapper/form";
import {
  BreakFormData,
  defaultValuesBreak,
} from "@/features/bar/break-form/schema";
import { defaultRemarksValue } from "@/features/bar/penalty/schema";
import { useAbility } from "@/providers/ability-provider";
import { useEmployees } from "@/providers/employees-provider";
import { MONTHS } from "@/utils/get-month-days";
import { parseISO } from "date-fns";
import { Activity, useEffect } from "react";
import { BarFormValues, barSchema, defaultValuesBarForm } from "./schema";

import { createTipsAdd } from "@/app/actions/tips-add/tips-add-actions";
import BreakTable from "@/features/bar/break-form/break-table";
import PenaltyTable from "@/features/bar/penalty/penalty-table";
import { useHashParam } from "@/hooks/use-hash";
import { useRealtimeSave } from "@/hooks/use-realtime-save";
import ReportBarTable from "./report/report-bar-table";
import TipsAddForm from "./tips-add/tips-add-form";

const BAR_EMPLOYEES = ["waiters", "barmen"];

export default function BarForm({
  realtimeData,
  dataBreakList,
  currencyUSD,
}: {
  realtimeData: BarFormValues | null;
  dataBreakList: BreakFormData | null;
  currencyUSD: number | null;
}) {
  const [tab] = useHashParam("tab");

  const { isBar, isAdmin } = useAbility();
  const isDisabled = !(isAdmin || isBar);

  const employeesName = useEmployees()
    .filter((emp) => BAR_EMPLOYEES.includes(emp.role))
    .filter((emp) => emp.status === "active")
    .map((e) => {
      return { name: e.name, id: e.id, role: e.role };
    });

  const form = useForm<BarFormValues>({
    defaultValues: defaultValuesBarForm,
    resolver: zodResolver(barSchema),
  });
  const { control, formState } = form;

  const values = useWatch({
    control: control,
  });

  const tipsArrayByEmployee = useFieldArray({
    control: control,
    name: "tipsAdd",
    keyName: "fieldId",
  });

  const employeeNamesInBreak = useWatch({
    control: control,
    name: "breakForm.rows",
  });

  useRealtimeSave(values, isBar && formState.isDirty, async (data) => {
    if (!data) return;
    await realtimeReportBar(data as BarFormValues);
  });

  const onSubmit: SubmitHandler<BarFormValues> = async (data) => {
    const { date, report, penalty, breakForm, tipsAdd } = data;

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

    const formattedTipsAddData = {
      day,
      uniqueKey,
      tipsAdd: tipsAdd,
      currency: currencyUSD?.toString() ?? "18",
    };

    await createTipsAdd(formattedTipsAddData);

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
      breakForm: defaultValuesBreak(dataBreakList?.rows ?? []),
      tipsAdd: [],
    });
    await realtimeReportBar({
      date: new Date(),
      report: updatedData,
      penalty: defaultRemarksValue,
      breakForm: defaultValuesBreak(dataBreakList?.rows ?? []),
      tipsAdd: [],
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
        realtimeData.breakForm ?? defaultValuesBreak(dataBreakList?.rows ?? []),
      tipsAdd: realtimeData.tipsAdd ?? [],
    });
  }, [realtimeData, form]);

  const selectedMap = new Map(
    employeeNamesInBreak
      .flatMap((item) =>
        item.name ? [{ name: item.name.trim(), idShift: item.id }] : [],
      )
      .filter((item) => item.name !== "")
      .map((item) => [item.name, item.idShift]),
  );

  const filteredEmployees = employeesName
    .filter((emp) => selectedMap.has(emp.name.trim()))
    .map((emp) => ({
      ...emp,
      idShift: selectedMap.get(emp.name.trim()),
    }));

  return (
    <FormInput
      form={form}
      onSubmit={onSubmit}
      onError={() => {
        toast.error("Заполните обязательные красные поля");
      }}
      disabled={isDisabled}
    >
      <Activity mode={tab === "break" ? "visible" : "hidden"}>
        <BreakTable isDisabled={isDisabled} employeesName={employeesName} />
        <PenaltyTable isDisabled={isDisabled} />
      </Activity>
      <Activity mode={tab === "report" ? "visible" : "hidden"}>
        <ReportBarTable isDisabled={isDisabled} />
      </Activity>
      <Activity mode={tab === "tips" ? "visible" : "hidden"}>
        <TipsAddForm
          tipsArrayByEmployee={tipsArrayByEmployee}
          options={filteredEmployees}
          disabled={!isAdmin}
          currency={currencyUSD?.toFixed(2) ?? "0"}
        />
      </Activity>
    </FormInput>
  );
}
