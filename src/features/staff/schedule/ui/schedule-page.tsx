"use client";

import { Table } from "@/components/ui/table";
import FormWrapper from "@/components/wrapper/form-wrapper";

import { useIsMobile } from "@/hooks/use-mobile";
import { useEdit } from "@/providers/edit-provider";
import { useMonthDays } from "@/providers/month-days-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import {
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { EMPLOYEE_ROLES_BY_DEPARTMENT } from "../model/constants";
import ScheduleTableBody from "./schedule-body";
import ScheduleCreateTableBody from "./schedule-create-body";
import ScheduleTableFooter from "./schedule-footer";
import ScheduleTableHeader from "./schedule-header";
import { defaultSchedule, scheduleSchema, ScheduleType } from "../model/schema";
import { useSelectedEmployeesByRole } from "../hooks/use-selected-employees-by-role";
import { calculateSalaryByHours, calculateShiftTotals, getShiftCounts } from "../lib/utils";
import { GetScheduleData } from "../model/type";
import { createSchedule } from "../actions/create-schedule";


export  function SchedulePage({
  schedules,
}: {
  schedules: GetScheduleData[] | null;
}) {

  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const schedule = schedules?.find((s) => s.id === tab) ?? null;

  const isMobile = useIsMobile();

  const todayDay = new Date().getDate();

  const [selectedDay, setSelectedDay] = useState<number>(todayDay);

  const { isEdit, setIsEdit } = useEdit();

  const form = useForm<ScheduleType>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: defaultSchedule,
  });
  const { fields, remove, replace, move, update } = useFieldArray({
    control: form.control,
    name: "rowShifts",
  });

  const selectedEmployees = useSelectedEmployeesByRole(
    tab as keyof typeof EMPLOYEE_ROLES_BY_DEPARTMENT,
  );

  const { daysCount, month, year } = useMonthDays();

  const rowShifts = isEdit ? form.watch("rowShifts") : schedule?.rowShifts;
  const shiftCounts = getShiftCounts(rowShifts ?? []);

  const onSubmit: SubmitHandler<ScheduleType> = async (data) => {
    const rowShiftsWithHours = data.rowShifts.map((row) => {
      if (!row.shifts) return row;
      const { totalDay, totalNight, total } = calculateShiftTotals(row.shifts);

      const totalPay = calculateSalaryByHours({
        ...row,
        dayHours: totalDay.toString(),
        nightHours: totalNight.toString(),
        totalHours: total.toString(),
      });

      return {
        ...row,
        dayHours: totalDay.toString(),
        nightHours: totalNight.toString(),
        totalHours: total.toString(),
        salary: totalPay.toFixed(0).toString(),
      };
    });
    const formatData = {
      year,
      month,
      role: tab as keyof typeof EMPLOYEE_ROLES_BY_DEPARTMENT,
      rowShifts: rowShiftsWithHours,
    };

    await createSchedule(formatData);
    toast.success("График успешно создан!");

    setIsEdit(false);
  };

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

    const newRows = selectedEmployees.map((employee, index) => ({
      id: index.toString(),
      dayHours: "",
      nightHours: "",
      totalHours: "",
      salary: "",
      employee: employee.name,
      role: employee.role,
      rate: employee.rate,
      employeeId: employee.id,
      shifts: Array(daysCount).fill(""),
    }));

    replace(newRows);
  }, [schedule, tab, isEdit]);

  const refCell = useRef<HTMLTableElement>(null);

  const scrollTableToStart = useEffectEvent(() => {
    if (!isMobile) return;

    const scrollContainer = refCell.current?.closest<HTMLElement>(
      '[data-slot="table-container"]',
    );

    if (!scrollContainer) return;

    scrollContainer.scrollLeft = 140;
  });

  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      scrollTableToStart();
    });
  }, [tab]);

  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <Table ref={refCell} className="mt-4 table-fixed">
        <ScheduleTableHeader
          addNewRow={addRow}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          isEdit={isEdit}
        />

        {!isEdit ? (
          <ScheduleTableBody schedule={schedule} selectedDay={selectedDay} />
        ) : (
          <ScheduleCreateTableBody
            fields={fields}
            selectedEmployees={selectedEmployees}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            remove={remove}
            move={move}
            update={update}
          />
        )}

        <ScheduleTableFooter shiftCounts={shiftCounts} role={tab as string} />
      </Table>
    </FormWrapper>
  );
}


