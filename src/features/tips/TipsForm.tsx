"use client";

import { Resolver, useFieldArray, useForm } from "react-hook-form";
import { defaultTipsForm, TipsFormType, tipsSchema } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form } from "@/components/ui/form";
import { Table } from "@/components/ui/table";
import { useEffect, useMemo } from "react";
import { getMonthDays } from "@/utils/getMonthDays";

import { useEmployees } from "@/providers/EmployeesProvider";

import { saveTipsForm } from "@/app/actions/tips/tipsAction";
import { toast } from "sonner";
import { useAbility } from "@/providers/AbilityProvider";
import FilterHeader from "./FilterHeader";
import TableHeaderData from "./TableHeader";
import TableFooterData from "./TableFooter";
import { groupRowsByRole } from "./utils";
import TableBodyData from "./TabelBody";
import NumericInput from "@/components/inputs/NumericInput";
import TextInput from "@/components/inputs/TextInput";

const SELECTED_ROLE = ["barmen", "waiters", "dish"];

export default function TipsForm({
  dataTips,
  dataCash,
}: {
  dataTips: any[];
  dataCash: any[];
}) {
  const { isAdmin, isMngr, isCash } = useAbility();
  const isDisabled = !isAdmin && !isMngr && !isCash;

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

  const employees = useEmployees();
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

  // Функция отправки формы
  const onSubmit = async (data: TipsFormType) => {
    const { cashTips, ...dataWithoutCash } = data;
    console.log("Submitting data:", dataWithoutCash);
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
    console.log("dataTips", dataTipsForMonth);
    const dataCashForMonth = dataCash.find(
      (item: any) => item.unique_id === unique_id
    );

    if (dataCashForMonth || dataTipsForMonth) {
      form.reset({
        ...dataTipsForMonth.form_data,
        cashTips:
          dataCashForMonth &&
          dataCashForMonth?.form_data?.rowCashData?.tipsByDay,
      } as TipsFormType);
    }
  }, [month, year, dataTips, dataCash]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        className="flex flex-col"
      >
        <div className="grid grid-cols-[25%_75%] items-center">
          <FilterHeader isDisabled={isDisabled} />
          <div className="flex gap-4 justify-start items-center">
            <TextInput fieldName="waitersDishBid" className="w-15" />
            <TextInput fieldName="barmenDishBid" className="w-15" />
            <TextInput fieldName="dishDishBid" className="w-15" />
            <TextInput fieldName="percentTips" className="w-15" />
          </div>
        </div>

        <Table className="md:table-fixed">
          <TableHeaderData monthDays={monthDays} month={month} />

          <TableBodyData
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

          <TableFooterData
            monthDays={monthDays}
            disabled={!isAdmin && !isCash}
            form={form}
            dataRowsCount={dataRowsCount.length}
          />
        </Table>
      </form>
    </Form>
  );
}
