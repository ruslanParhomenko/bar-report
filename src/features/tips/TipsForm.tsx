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

const SELECTED_ROLE = ["barmen", "waiters", "dish"];

export default function TipsForm({ initialData }: { initialData: any[] }) {
  const { isAdmin, isMngr, isCash } = useAbility();
  const isDisabled = !isAdmin && !isMngr;

  // form
  const form = useForm<TipsFormType>({
    resolver: yupResolver(tipsSchema) as unknown as Resolver<TipsFormType>,
    defaultValues: defaultTipsForm,
  });

  const { fields, remove, append, move, replace } = useFieldArray<TipsFormType>(
    {
      control: form.control,
      name: "rowEmployeesTips",
    }
  );

  const month = form.watch("month");
  const year = form.watch("year");

  // список сотрудников
  const employees = useEmployees();
  const selectedEmployees = useMemo(() => {
    return employees
      .filter((emp) => SELECTED_ROLE.includes(emp.role))
      .filter((emp) => !["barmen", "waiter", "dish"].includes(emp.name))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [employees]);

  // вычисляем дни месяца
  const monthDays = useMemo(() => {
    if (!month || !year) return [];
    return getMonthDays({ month, year });
  }, [month, year]);

  // когда выбран месяц или год — создаем строки для всех сотрудников
  useEffect(() => {
    if (!month || !year || selectedEmployees.length === 0) return;

    const newRows = selectedEmployees.map((employee, index) => ({
      id: (index + 1).toString(),
      employeeId: employee.id ?? "",
      employee: employee.name ?? "",
      role: employee.role ?? "",
      rate: "",
      tips: "",
      tipsByDay: Array(monthDays.length).fill(""),
    }));

    form.setValue("rowEmployeesTips", newRows);
    form.setValue("cashTips.tipsByDay", Array(monthDays.length).fill(""));
  }, [month, year, selectedEmployees, monthDays.length]);

  // сброс формы
  const resetForm = () => {
    form.reset(defaultTipsForm);
    replace([]); // очищаем таблицу
  };

  // Функция отправки формы
  const onSubmit = async (data: TipsFormType) => {
    await saveTipsForm(data);
    toast.success("Форма сохранена успешно!");
  };
  // добавить новую строку вручную
  const addNewRow = () => {
    append({
      id: (fields.length + 1).toString(),
      employeeId: "",
      employee: "",
      role: "",
      rate: "",
      tips: "",
      tipsByDay: Array(monthDays.length).fill(""),
    });
  };

  const rowsByRole = useMemo(() => groupRowsByRole(fields), [fields]);
  const dataRowsCount = Object.values(rowsByRole).flat();

  useEffect(() => {
    if (!initialData || !month || !year) return;

    const unique_id = `${year}_${month}`;
    const dataForMonth = initialData.find(
      (item: any) => item.unique_id === unique_id
    );

    if (dataForMonth) {
      form.reset({
        ...dataForMonth.form_data,
        id: dataForMonth.id,
      } as TipsFormType);
    }
  }, [month, year, initialData]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        className="flex flex-col"
      >
        <FilterHeader isDisabled={isDisabled} />

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
