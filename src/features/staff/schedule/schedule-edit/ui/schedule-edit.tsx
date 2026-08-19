"use client";
import { Table } from "@/components/ui/table";
import FormWrapper from "@/components/wrapper/form-wrapper";
import { useMonthDays } from "@/hooks/use-month-days";
import { useEmployees } from "@/providers/employees-provider";
import { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";
import ScheduleTableFooter from "../../schedule-view/ui/schedule-footer";
import ScheduleTableHeader from "../../schedule-view/ui/schedule-header";
import { useScheduleForm } from "../hooks/use-schedule-form";
import { useSelectedEmployeesByRole } from "../hooks/use-selected-employees-by-role";
import { createEmptyRowShifts, getShiftCounts } from "../lib/utils";
import { EMPLOYEE_ROLES_BY_DEPARTMENT } from "../model/constants";
import { GetScheduleData } from "../model/type";
import ScheduleBodyEdit from "./schedule-body-edit";

export function ScheduleEdit({
  schedule,
  tab,
}: {
  schedule: GetScheduleData | null;
  tab: string;
}) {
  const { daysCount } = useMonthDays();

  const todayDay = new Date().getDate();

  const [selectedDay, setSelectedDay] = useState<number>(todayDay);

  const { form, onSubmit } = useScheduleForm(tab);
  const employees = useEmployees();
  const selectedEmployees = useSelectedEmployeesByRole(
    tab as keyof typeof EMPLOYEE_ROLES_BY_DEPARTMENT,
    employees,
  );

  const { fields, remove, replace, move, update } = useFieldArray({
    control: form.control,
    name: "rowShifts",
  });

  const rowShifts = form.watch("rowShifts");
  const shiftCounts = getShiftCounts(rowShifts ?? []);

  function addRow() {
    replace([
      ...fields,
      {
        id: (fields.length + 1).toString(),
        dayHours: "",
        nightHours: "",
        totalHours: "",
        employee: "",
        salary: "",
        role: "",
        rate: "",
        employeeId: "",
        shifts: Array(daysCount).fill(""),
      },
    ]);
  }

  useEffect(() => {
    if (schedule) {
      form.reset(schedule);
      return;
    }

    replace(createEmptyRowShifts(selectedEmployees, daysCount));
  }, [schedule]);
  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <Table className="mt-4 table-fixed">
        <ScheduleTableHeader
          addNewRow={addRow}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          isEdit={true}
        />

        <ScheduleBodyEdit
          selectedDay={selectedDay}

          fields={fields}
          selectedEmployees={selectedEmployees}
          setSelectedDay={setSelectedDay}
          remove={remove}
          move={move}
          update={update}
        />

        <ScheduleTableFooter shiftCounts={shiftCounts} role={tab as string} />
      </Table>
    </FormWrapper>
  );
}
