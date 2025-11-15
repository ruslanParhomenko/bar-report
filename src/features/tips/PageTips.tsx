"use client";

import {
  Resolver,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { defaultTipsForm, TipsFormType, tipsSchema } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Table } from "@/components/ui/table";
import { useEffect, useMemo } from "react";
import { getMonthDays } from "@/utils/getMonthDays";
import { useEmployees } from "@/providers/EmployeesProvider";
import { saveTipsForm } from "@/app/actions/tips/tipsAction";
import { toast } from "sonner";
import { useAbility } from "@/providers/AbilityProvider";
import { groupRowsByRole } from "./utils";
import { FormWrapper } from "@/components/wrapper/FormWrapper";
import { FilterDataByMonth } from "@/components/filter/FilterDataByMonth";
import { useTips } from "@/providers/TipsProvider";
import { useCash } from "@/providers/CashProvider";
import { TipsTableHeader } from "./TipsTableHeader";
import { TipsTableBody } from "./TipsTableBody";
import { TipsTableFooter } from "./TipsTableFooter";

const SELECTED_ROLE = ["barmen", "waiters", "dish"];

export function PageTips() {
  // get data
  const dataTips = useTips();
  const dataCash = useCash();
  const employees = useEmployees();

  const { isAdmin, isManager, isCash } = useAbility();
  const isDisabled = !isAdmin && !isManager;

  // form
  const form = useForm<TipsFormType>({
    resolver: yupResolver(tipsSchema) as unknown as Resolver<TipsFormType>,
    defaultValues: defaultTipsForm,
  });

  const { fields, remove, append, move } = useFieldArray<TipsFormType>({
    control: form.control,
    name: "rowEmployeesTips",
  });

  const month = form.watch("month");
  const year = form.watch("year");

  const selectedEmployees = useMemo(() => {
    return employees
      .filter((emp) => SELECTED_ROLE.includes(emp.role))
      .filter((emp) => !["barmen", "waiter", "dish"].includes(emp.name))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [employees]);

  const monthDays = useMemo(() => {
    if (!month || !year) return [];
    return getMonthDays({ month, year });
  }, [month, year]);

  useEffect(() => {
    if (!month || !year || selectedEmployees.length === 0) return;

    const newRows = selectedEmployees.map((employee, index) => ({
      id: (index + 1).toString(),
      employee: employee.name ?? "",
      role: employee.role ?? "",
      tips: "",
      tipsByDay: Array(monthDays.length).fill(""),
    }));

    form.setValue("rowEmployeesTips", newRows);
    form.setValue("cashTips", Array(monthDays.length).fill(""));
  }, [month, year, selectedEmployees, monthDays.length]);

  // submit
  const onSubmit: SubmitHandler<TipsFormType> = async (data) => {
    const { cashTips, ...dataWithoutCash } = data;

    await saveTipsForm(dataWithoutCash);
    toast.success("Форма сохранена успешно!");
  };

  const rowsByRole = useMemo(() => groupRowsByRole(fields), [fields]);
  const dataRowsCount = Object.values(rowsByRole).flat();

  useEffect(() => {
    if (!dataTips || !month || !year) return;

    const unique_id = `${year}-${month}`;
    const dataTipsForMonth = dataTips.find(
      (item: any) => item.unique_id === unique_id
    );

    const dataCashForMonth = dataCash.find(
      (item: any) => item.unique_id === unique_id
    );

    if (dataCashForMonth || dataTipsForMonth) {
      form.reset({
        ...dataTipsForMonth?.form_data,
        cashTips:
          dataCashForMonth &&
          dataCashForMonth?.form_data?.rowCashData?.tipsByDay,
      } as TipsFormType);
    }
  }, [month, year, dataTips, dataCash]);

  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <FilterDataByMonth withButton={true} disabled={isDisabled} />

      <Table className="md:table-fixed">
        <TipsTableHeader monthDays={monthDays} month={month} />

        <TipsTableBody
          data={fields}
          monthDays={monthDays}
          form={form}
          disabled={isDisabled}
          remove={remove}
          append={append}
          move={move}
          dataRowsCount={dataRowsCount}
          selectedEmployees={selectedEmployees}
        />

        <TipsTableFooter
          monthDays={monthDays}
          disabled={!isAdmin && !isCash}
          form={form}
          dataRowsCount={dataRowsCount.length}
        />
      </Table>
    </FormWrapper>
  );
}
