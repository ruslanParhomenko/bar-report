"use client";

import { Table } from "@/components/ui/table";
import FormWrapper from "@/components/wrapper/form-wrapper";

import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { useAccessCheck } from "@/hooks/use-tab-access";
import { useEdit } from "@/providers/edit-provider";
import { useEmployees } from "@/providers/employees-provider";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { useMobileTableScroll } from "../hooks/use-mobile-table-scroll";
import { useScheduleForm } from "../hooks/use-schedule-form";
import { useSelectedEmployeesByRole } from "../hooks/use-selected-employees-by-role";
import { createEmptyRowShifts, getShiftCounts } from "../lib/utils";
import { EMPLOYEE_ROLES_BY_DEPARTMENT } from "../model/constants";
import { GetScheduleData } from "../model/type";
import ScheduleTableBody from "./schedule-body";
import ScheduleCreateTableBody from "./schedule-create-body";
import ScheduleTableFooter from "./schedule-footer";
import ScheduleTableHeader from "./schedule-header";
import { useMonthDays } from "@/hooks/use-month-days";

type Props = {
  schedules: GetScheduleData[] | null;
  isAdmin: boolean;
};

export function SchedulePage({ schedules, isAdmin }: Props) {
  const hasAccess = useAccessCheck();
  const { daysCount } = useMonthDays();
  const { isEdit } = useEdit();
  const searchParams = useSearchParams();

  const employees = useEmployees();

  const tab = searchParams.get("tab");

  const schedule = schedules?.find((s) => s.id === tab) ?? null;

  const todayDay = new Date().getDate();
  const [selectedDay, setSelectedDay] = useState<number>(todayDay);

  const { form, onSubmit } = useScheduleForm(tab);

  const { fields, remove, replace, move, update } = useFieldArray({
    control: form.control,
    name: "rowShifts",
  });



  const selectedEmployees = useSelectedEmployeesByRole(
    tab as keyof typeof EMPLOYEE_ROLES_BY_DEPARTMENT,
    employees,
  );

  const rowShifts = isEdit ? form.watch("rowShifts") : schedule?.rowShifts;
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

  const refCell = useRef<HTMLTableElement>(null!);
  useMobileTableScroll(refCell, tab ?? "");

  useEffect(()=>{

    if(schedule && isEdit){
      form.reset(schedule);
    }

    if(!schedule && !isEdit){
      replace(createEmptyRowShifts(selectedEmployees, daysCount));
    }

  },[isEdit,schedule])

  const BodyComponent = isEdit ? ScheduleCreateTableBody : ScheduleTableBody;

  if (!hasAccess) return <InsufficientRights />;

  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <Table ref={refCell} className="mt-4 table-fixed">
        <ScheduleTableHeader
          addNewRow={addRow}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          isEdit={isEdit}
        />

        <BodyComponent
          schedule={schedule}
          selectedDay={selectedDay}

          fields={fields}
          selectedEmployees={selectedEmployees}
          setSelectedDay={setSelectedDay}
          remove={remove}
          move={move}
          update={update}
          isAdmin={isAdmin}
        />

        <ScheduleTableFooter shiftCounts={shiftCounts} role={tab as string} />
      </Table>
    </FormWrapper>
  );
}
