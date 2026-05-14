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
import { createTipsAdd } from "@/app/actions/tips-add/tips-add-actions";

import { BreakForm, breakListDefault } from "@/features/bar/break-form/schema";
import { useAbility } from "@/providers/ability-provider";
import { useEmployees } from "@/providers/employees-provider";
import { MONTHS } from "@/utils/get-month-days";

import { BarForm, barPageDefault, barPageSchema } from "./schema";

import DatePickerInput from "@/components/input-controlled/date-input";
import FormWrapper from "@/components/wrapper/form-wrapper";
import BreakTable from "@/features/bar/break-form/break-table";
import PenaltyTable from "@/features/bar/penalty/penalty-table";

import { useLocalStorageForm } from "@/hooks/use-local-storage";
import { usePathname, useSearchParams } from "next/navigation";
import { remarksDefault } from "./penalty/schema";
import ReportBarTable from "./report/report-bar-table";
import TipsAddForm from "./tips-add/tips-add-form";

import { TABS_BY_ROUTE } from "@/constants/header-bar";
import { useSwipeable } from "react-swipeable";

const BAR_EMPLOYEES = ["waiters", "barmen"];
const KEY_LOCALSTORAGE = "report-bar-form";

export default function BarPage({
  dataBreakList,
  currencyUSD,
}: {
  dataBreakList: BreakForm | null;
  currencyUSD: number | null;
}) {
  const pathname = usePathname();
  const mainRoute = pathname.split("/")[1] || "";

  const STORAGE_KEY = `nav-tab-${pathname}`;

  const TABS = (TABS_BY_ROUTE[mainRoute as keyof typeof TABS_BY_ROUTE] ??
    []) as readonly string[];

  const searchParams = useSearchParams();

  const tab = searchParams.get("tab");

  const handleTabChange = (value: string) => {
    localStorage.setItem(STORAGE_KEY, value);

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);

    window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      const currentIndex = TABS.indexOf(tab ?? "");
      const nextIndex = (currentIndex + 1) % TABS.length;
      const nextTab = TABS[nextIndex];
      handleTabChange(nextTab);
    },
    onSwipedRight: () => {
      const currentIndex = TABS.indexOf(tab ?? "");
      const prevIndex = (currentIndex - 1 + TABS.length) % TABS.length;
      const prevTab = TABS[prevIndex];
      handleTabChange(prevTab);
    },
    trackMouse: true,
  });

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
    await createRemarks({ day, month, year, remarks: penalty });

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
    <FormWrapper
      form={form}
      onSubmit={onSubmit}
      onError={onError}
      className="h-full"
      swipeHandlers={handlers}
    >
      <DatePickerInput
        fieldName="date"
        className="text-rd h-6 text-sm"
        disabled
      />
      {tab === "break" && (
        <>
          <BreakTable isDisabled={isDisabled} employeesName={employeesName} />
          <PenaltyTable isDisabled={isDisabled} />
        </>
      )}

      {tab === "report" && <ReportBarTable isDisabled={isDisabled} />}

      {tab === "tips" && (
        <TipsAddForm
          tipsArrayByEmployee={tipsArrayByEmployee}
          options={filteredEmployees}
          disabled={!isAdmin}
          currency={currencyUSD?.toFixed(2) ?? "0"}
        />
      )}
    </FormWrapper>
  );
}
