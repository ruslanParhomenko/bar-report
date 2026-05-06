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
  expensesDefault,
  inventoryDefault,
  productTransferDefault,
} from "./report/schema";

import { zodResolver } from "@hookform/resolvers/zod";

import { createBreakList } from "@/app/actions/break/break-action";
import { createRemarks } from "@/app/actions/remarks/remarks-action";
import { createReportBar } from "@/app/actions/report-bar/report-bar-action";
import { BreakForm, breakListDefault } from "@/features/bar/break-form/schema";
import { useAbility } from "@/providers/ability-provider";
import { useEmployees } from "@/providers/employees-provider";
import { MONTHS } from "@/utils/get-month-days";
import { Activity } from "react";
import { BarForm, barPageDefault, barPageSchema } from "./schema";

import DatePickerInput from "@/components/input-controlled/date-input";
import FormWrapper from "@/components/wrapper/form-wrapper";
import BreakTable from "@/features/bar/break-form/break-table";
import PenaltyTable from "@/features/bar/penalty/penalty-table";
import { useHashParam } from "@/hooks/use-hash";
import { useLocalStorageForm } from "@/hooks/use-local-storage";
import { remarksDefault } from "./penalty/schema";
import ReportBarTable from "./report/report-bar-table";
import TipsAddForm from "./tips-add/tips-add-form";

const BAR_EMPLOYEES = ["waiters", "barmen"];
const KEY_LOCALSTORAGE = "report-bar-form";

export default function BarPage({
  dataBreakList,
  currencyUSD,
}: {
  dataBreakList: BreakForm | null;
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

  const form = useForm<BarForm>({
    defaultValues: barPageDefault,
    resolver: zodResolver(barPageSchema),
  });
  const { control } = form;

  const tipsArrayByEmployee = useFieldArray({
    control: control,
    name: "tipsAdd",
    keyName: "fieldId",
  });

  const employeeNamesInBreak = useWatch({
    control: control,
    name: "breakForm.rows",
  });

  const { isLoaded } = useLocalStorageForm(form, KEY_LOCALSTORAGE);

  const onSubmit: SubmitHandler<BarForm> = async (data) => {
    // if (!isBar) return;
    const { date, report, penalty, breakForm, tipsAdd } = data;

    const dateObj = new Date(date);
    const day = String(dateObj.getDate());
    const month = MONTHS[dateObj.getMonth()];
    const year = dateObj.getFullYear().toString();

    const formateReportData = {
      day,
      month,
      year,

      report: {
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
      },
    };

    const formattedBreakData = {
      day,
      month,
      year,
      rows: breakForm.rows,
    };
    const formattedPenaltyData = {
      remarks: penalty,
      month: month,
      year: year,
      day: day,
    };

    const formattedTipsAddData = {
      day,
      uniqueKey: `${year}-${month}`,
      tipsAdd: tipsAdd,
      currency: currencyUSD?.toString() ?? "18",
    };

    // await createTipsAdd(formattedTipsAddData);
    await createReportBar(formateReportData);
    await createBreakList(formattedBreakData);
    await createRemarks(formattedPenaltyData);

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
      date: new Date().toISOString(),
      report: updatedData,
      penalty: remarksDefault,
      breakForm: breakListDefault(dataBreakList?.rows ?? []),
      tipsAdd: [],
    });

    toast.success("Бар отчет успешно сохранён !");
  };

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

  const onError = () => {
    toast.error("Заполните обязательные красные поля");
  };

  if (!isLoaded) return null;
  return (
    <FormWrapper form={form} onSubmit={onSubmit} onError={onError}>
      <DatePickerInput
        fieldName="date"
        className="text-rd h-6 text-sm"
        disabled
      />
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
    </FormWrapper>
  );
}
