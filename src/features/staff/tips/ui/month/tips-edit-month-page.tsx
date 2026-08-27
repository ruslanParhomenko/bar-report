"use client";

import { Table } from "@/components/ui/table";
import FormWrapper from "@/components/wrapper/form-wrapper";
import { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";

import { TipsForm } from "../../model/schema";

import { Employee } from "@/features/settings/create-employee/model/type";
import useFormTips from "@/features/staff/tips/hooks/use-form-tips";
import { TipsEditTableFooter } from "@/features/staff/tips/ui/month/tips-edit-footer";
import { useMonthDays } from "@/hooks/use-month-days";
import { GetTipsData } from "../../model/type";
import BidEdit from "./bid-edit";
import { TipsEditTableBody } from "./tips-edit-body";
import TipsHeaderTable from "./tips-header";

const SELECTED_ROLE = ["waiters", "barmen"] as const;

export default function TipsEditMonthPage({
  dataTipsYear,
  employees,
}: {
  dataTipsYear: GetTipsData[] | null;
  employees: Employee[];
}) {
  const todayDay = new Date().getDate();
  const [selectedDay, setSelectedDay] = useState<number>(todayDay);
  const { monthDays, month, year } = useMonthDays();

  const dataTips = dataTipsYear?.find((data) => data.id === month) || null;

  const activeEmployees = employees
    .filter((e) => e.status === "active")
    .filter((e) =>
      SELECTED_ROLE.includes(e.role as (typeof SELECTED_ROLE)[number]),
    );

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
      form.reset(dataTips.tipsData);

      return;
    }

    const newRows = activeEmployees.map((employee, index) => ({
      id: (index + 1).toString(),
      employee: employee.name ?? "",
      role: employee.role ?? "",
      tipsByDay: Array(monthDays.length).fill(""),
    }));
    const mewRowsCashTips = Array(monthDays.length).fill("");

    form.setValue("rowEmployeesTips", newRows);
    form.setValue("rowCashTips", mewRowsCashTips);
  }, [dataTips, month, year, form, monthDays.length]);

  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <BidEdit />

      <Table className="table-fixed">
        <TipsHeaderTable
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          addNewRow={addNewRow}
          isEdit={true}
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
