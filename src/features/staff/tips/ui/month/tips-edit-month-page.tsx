"use client";

import { Table } from "@/components/ui/table";
import FormWrapper from "@/components/wrapper/form-wrapper";
import { Employee } from "@/features/settings/create-employee/model/type";
import useFormTips from "@/features/staff/tips/hooks/use-form-tips";
import { TipsEditTableFooter } from "@/features/staff/tips/ui/month/tips-edit-footer";
import { GetTipsAddData } from "@/features/tips-add/model/type";
import { useMonthDays } from "@/hooks/use-month-days";
import { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { TipsForm } from "../../model/schema";
import { GetTipsData } from "../../model/type";
import BidEdit from "./bid-edit";
import { TipsEditTableBody } from "./tips-edit-body";
import TipsHeaderTable from "./tips-header";

const SELECTED_ROLE = ["waiters", "barmen"] as const;

export default function TipsEditMonthPage({
  dataTipsYear,
  employees,
  dataTipsAdd,
}: {
  dataTipsYear: GetTipsData[] | null;
  employees: Employee[] | null;
  dataTipsAdd: GetTipsAddData[] | null;
}) {
  const todayDay = new Date().getDate();
  const [selectedDay, setSelectedDay] = useState<number>(todayDay);
  const { monthDays, month, year } = useMonthDays();

  const [selectedDayTips, setSelectedDayTips] = useState<string | null>(null);

  const dataTips =
    dataTipsYear?.find((data) => data.id === month)?.tipsData || null;

  const sortedDataTips = [...(dataTips?.rowEmployeesTips ?? [])].sort(
    (a, b) =>
      a.role.localeCompare(b.role) || a.employee.localeCompare(b.employee),
  );

  const activeEmployees =
    employees
      ?.filter((e) => e.status === "active")
      .filter((e) =>
        SELECTED_ROLE.includes(e.role as (typeof SELECTED_ROLE)[number]),
      ) || null;

  const { form, onSubmit } = useFormTips();

  const { fields, remove, append } = useFieldArray<TipsForm>({
    control: form.control,
    name: "rowEmployeesTips",
  });

  const addNewRow = () => {
    append({
      id: (fields.length + 1).toString(),
      employee: "",
      role: "",
      tipsByDay: Array(monthDays.length).fill(""),
    });
  };

  const removeRow = (index: number) => {
    remove(index);
  };

  useEffect(() => {
    if (dataTips) {
      form.reset({
        ...dataTips,
        rowEmployeesTips: sortedDataTips,
      });

      return;
    }

    const newRows = activeEmployees?.map((employee, index) => ({
      id: (index + 1).toString(),
      employee: employee.name ?? "",
      role: employee.role ?? "",
      tipsByDay: Array(monthDays.length).fill(""),
    }));
    const mewRowsCashTips = Array(monthDays.length).fill("");

    if (newRows) {
      form.setValue("rowEmployeesTips", newRows);
    }

    form.setValue("rowCashTips", mewRowsCashTips);
  }, [dataTips, month, year, form, monthDays.length]);

  useEffect(() => {
    if (!dataTipsAdd || !selectedDayTips) return;

    const dayDoc = dataTipsAdd.find((d) => d.id === selectedDayTips);
    if (!dayDoc) return;

    const rows = form.getValues("rowEmployeesTips");
    const dayIndex = +selectedDayTips - 1;

    dayDoc.tipsAdd.forEach((tip) => {
      if (!tip.resultAmount.length) return; // не затираем барменов

      const rowIndex = rows.findIndex((r) => r.employee === tip.employeeName);
      if (rowIndex === -1) return;

      const sum = tip.resultAmount
        .reduce((acc, c) => acc + Number(c.value), 0)
        .toFixed(0)
        .toString();

      form.setValue(`rowEmployeesTips.${rowIndex}.tipsByDay.${dayIndex}`, sum, {
        shouldDirty: true,
      });
    });
  }, [selectedDayTips]);
  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <BidEdit />

      <Table className="table-fixed">
        <TipsHeaderTable
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          addNewRow={addNewRow}
          isEdit={true}
          selectedDayTips={selectedDayTips}
          setSelectedDayTips={setSelectedDayTips}
        />

        <TipsEditTableBody
          data={fields}
          remove={removeRow}
          selectedEmployees={activeEmployees}
          selectedDay={selectedDay}
          monthDays={monthDays}
        />

        <TipsEditTableFooter />
      </Table>
    </FormWrapper>
  );
}
