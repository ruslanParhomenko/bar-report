"use client";

import {
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { toast } from "sonner";



import { zodResolver } from "@hookform/resolvers/zod";

import { useAbility } from "@/providers/ability-provider";
import { useEmployees } from "@/providers/employees-provider";
import { MONTHS } from "@/utils/get-month-days";

import { BarForm, barPageDefault, barPageSchema } from "../model/schema";

import DatePickerInput from "@/components/input-form/date-input";
import FormWrapper from "@/components/wrapper/form-wrapper";
import { useLocalStorageForm } from "@/hooks/use-local-storage";
import { useSearchParams } from "next/navigation";
import { remarksDefault } from "../../penalty/model/schema";

import { BreakPage } from "@/features/staff/bar/break/ui/break-page";
import { PenaltyPage } from "@/features/staff/bar/penalty/ui/penalty-page";

import { BAR_EMPLOYEES, KEY_LOCALSTORAGE } from "../model/constants";
import { createPenalty } from "../../penalty/actions/create-penalty";
import { BreakForm, breakListDefault } from "../../break/model/schema";
import { ReportBarPage } from "../../report";
import { TipsAddPage } from "../../tips-add";
import { createBreakList } from "../../break/actions/create-break";
import { cashVerifyDefault, expensesDefault, inventoryDefault, productTransferDefault } from "../../report/model/schema";
import { createTipsAdd } from "../../tips-add/actions/create-tips-add";
import { createReportBar } from "../../report/actions/create-bar-report";



export  function BarPage({
  dataBreakList,
  currencyUSD,
}: {
  dataBreakList: BreakForm | null;
  currencyUSD: number | null;
}) {
  const searchParams = useSearchParams();

  const tab = searchParams.get("tab");

  const { isBar, isAdmin } = useAbility();
  const isDisabled = !(isAdmin || isBar);

  const employeesName = useEmployees()
    .filter((emp) => BAR_EMPLOYEES.includes(emp.role))
    .filter((emp) => emp.status === "active")
    .map((e) => ({
      name: e.name,
      id: e.id,
      role: e.role,
    }));

  const form = useForm<BarForm>({
    defaultValues: {
      ...barPageDefault,
      breakForm: breakListDefault(dataBreakList?.rows ?? []),
    },
    resolver: zodResolver(barPageSchema),
  });

  const { control } = form;

  const { isLoaded } = useLocalStorageForm(form, KEY_LOCALSTORAGE);

  const tipsArrayByEmployee = useFieldArray({
    control,
    name: "tipsAdd",
    keyName: "fieldId",
  });

  const breakListValues = useWatch({
    control,
    name: "breakForm.rows",
  });

  const onSubmit: SubmitHandler<BarForm> = async (data) => {
    const { date, report, penalty, breakForm, tipsAdd } = data;

    const dateObj = new Date(date);
    const day = String(dateObj.getDate());
    const month = MONTHS[dateObj.getMonth()];
    const year = dateObj.getFullYear().toString();
    const currency = currencyUSD?.toFixed(2) ?? "18";

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

    await createTipsAdd({ day, month, year, tipsAdd, currency });
    await createReportBar(formateReportData);
    await createBreakList({ day, month, year, rows: breakForm.rows });
    await createPenalty({ day, month, year, remarks: penalty });

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

    const resetState: BarForm = {
      date: new Date().toISOString(),
      report: updatedData,
      penalty: remarksDefault,
      breakForm: breakListDefault(dataBreakList?.rows ?? []),
      tipsAdd: [],
    };

    form.reset(resetState);

    toast.success("Бар отчет успешно сохранён !");
  };

  const selectedMap = new Map(
    breakListValues
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

  if (!isLoaded) {
    return null;
  }
  return (
    <FormWrapper form={form} onSubmit={onSubmit} onError={onError}>
      <DatePickerInput
        fieldName="date"
        className="text-rd h-6 text-sm"
        disabled={!isAdmin}
      />
      {tab === "break" && (
        <>
          <BreakPage isDisabled={isDisabled} employeesName={employeesName} />
          <PenaltyPage isDisabled={isDisabled} />
        </>
      )}

      {tab === "report" && <ReportBarPage isDisabled={isDisabled} />}

      {tab === "tips" && (
        <TipsAddPage
          tipsArrayByEmployee={tipsArrayByEmployee}
          options={filteredEmployees}
          disabled={!isAdmin}
          currency={currencyUSD?.toFixed(2) ?? "0"}
        />
      )}
    </FormWrapper>
  );
}
