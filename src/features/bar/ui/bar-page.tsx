"use client";

import { useFieldArray, useWatch } from "react-hook-form";
import { toast } from "sonner";

import DatePickerInput from "@/components/input-form/date-input";
import FormWrapper from "@/components/wrapper/form-wrapper";
import { useLocalStorageForm } from "@/hooks/use-local-storage";
import { useSearchParams } from "next/navigation";

import { useBarForm } from "@/features/bar/hooks/use-bar-form";
import {
  BAR_EMPLOYEES,
  KEY_LOCALSTORAGE,
} from "@/features/bar/model/constants";
import { BreakPage } from "@/features/break";
import { BreakForm } from "@/features/break/model/schema";
import { PenaltyPage } from "@/features/penalty";
import { ReportBarPage } from "@/features/report-bar";
import { Employee } from "@/features/settings/create-employee/model/type";
import { TipsAddPage } from "@/features/tips-add";
import { useTabSwipeNavigation } from "@/hooks/use-tab-swipe-navigation";

export function BarPage({
  employees,
  dataBreakList,
  currencyUSD,
  orderProducts,
  isAdmin,
}: {
  employees: Employee[];
  dataBreakList: BreakForm | null;
  currencyUSD: number | null;
  orderProducts: Record<string, string[]> | null;
  isAdmin: boolean;
}) {
  const searchParams = useSearchParams();
  const { form, onSubmit } = useBarForm({
    dataBreakList,
    currencyUSD,
  });

  const tab = searchParams.get("tab");

  const employeesName = employees
    ?.filter((emp) => BAR_EMPLOYEES.includes(emp.role))
    .filter((emp) => emp.status === "active")
    .map((e) => ({
      name: e.name,
      id: e.id,
      role: e.role,
    }));

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

  const selectedMap = new Map(
    breakListValues
      .flatMap((item) =>
        item.name ? [{ name: item.name.trim(), idShift: item.id }] : [],
      )
      .filter((item) => item.name !== "")
      .map((item) => [item.name, item.idShift]),
  );

  const filteredEmployees = employeesName
    ?.filter((emp) => selectedMap.has(emp.name.trim()))
    .map((emp) => ({
      ...emp,
      idShift: selectedMap.get(emp.name.trim()),
    }));

  const onError = () => {
    toast.error("Заполните обязательные красные поля");
  };

  const { handlers } = useTabSwipeNavigation();

  if (!isLoaded) {
    return null;
  }
  return (
    <FormWrapper
      form={form}
      onSubmit={onSubmit}
      onError={onError}
      className="h-[80dvh]"
    >
      <DatePickerInput
        fieldName="date"
        className="text-rd h-6 text-sm"
        disabled={!isAdmin}
      />
      <div {...handlers} className="h-full">
        {tab === "break" && (
          <>
            <BreakPage employeesName={employeesName} />
            <PenaltyPage employees={employees} />
          </>
        )}

        {tab === "report" && <ReportBarPage orderProducts={orderProducts} />}

        {tab === "tips" && (
          <TipsAddPage
            tipsArrayByEmployee={tipsArrayByEmployee}
            options={filteredEmployees}
            disabled={!isAdmin}
            currency={currencyUSD?.toFixed(2) ?? "0"}
          />
        )}
      </div>
    </FormWrapper>
  );
}
