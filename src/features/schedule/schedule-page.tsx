"use client";
import {
  createSchedule,
  ScheduleData,
  SchedulesContextValue,
  updateSchedule,
} from "@/app/actions/schedule/schedule-action";
import { Form } from "@/components/ui/form";
import { Table } from "@/components/ui/table";
import { useHashParam } from "@/hooks/use-hash";
import { useEdit } from "@/providers/edit-provider";
import { useMonthDays } from "@/providers/month-days-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { EMPLOYEE_ROLES_BY_DEPARTMENT } from "./constants";
import ScheduleTableBody from "./schedule-body";
import ScheduleCreateTableBody from "./schedule-create-body";
import ScheduleTableFooter from "./schedule-footer";
import ScheduleTableHeader from "./schedule-header";
import { defaultSchedule, scheduleSchema, ScheduleType } from "./schema";
import {
  calculateShiftTotals,
  getSelectedEmployeesByRole,
  getShiftCounts,
} from "./utils";

export default function SchedulePage({
  schedules,
}: {
  schedules: SchedulesContextValue[] | null;
}) {
  const pathname = usePathname();
  const formId = pathname.split("/").pop() || "";

  const [tab] = useHashParam("tab");

  const schedule = schedules?.find((s: any) => s.role === tab) ?? null;

  // state
  const todayDay = new Date().getDate();
  const [selectedDay, setSelectedDay] = useState<number>(todayDay);

  const { isEdit, setIsEdit } = useEdit();

  // set form
  const form = useForm<ScheduleType>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: defaultSchedule,
  });
  const { fields, remove, replace, move, update } = useFieldArray({
    control: form.control,
    name: "rowShifts",
  });

  // set employees
  const selectedEmployees = getSelectedEmployeesByRole(
    tab as keyof typeof EMPLOYEE_ROLES_BY_DEPARTMENT,
  );

  // set days
  const { daysCount, month, year } = useMonthDays();

  const rowShifts = isEdit ? form.watch("rowShifts") : schedule?.rowShifts;
  const shiftCounts = getShiftCounts(rowShifts ?? []);

  // submit
  const onSubmit: SubmitHandler<ScheduleType> = async (data) => {
    const rowShiftsWithHours = data.rowShifts.map((row) => {
      if (!row.shifts) return row;
      const { totalDay, totalNight, total } = calculateShiftTotals(row.shifts);

      return {
        ...row,
        dayHours: totalDay.toString(),
        nightHours: totalNight.toString(),
        totalHours: total.toString(),
      };
    });

    const formatData: ScheduleData = {
      ...data,
      rowShifts: rowShiftsWithHours,
      uniqueKey: `${year}-${month}-${tab}`,
      month: month as string,
      year: year as string,
      role: tab as string,
    };

    if (schedule?.id) {
      await updateSchedule(schedule.id as string, formatData);
      toast.success("График успешно обновлён!");
    } else {
      await createSchedule(formatData);
      toast.success("График успешно создан!");
    }
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
      employee: employee.name,
      role: employee.role,
      rate: employee.rate,
      employeeId: employee.id,
      shifts: Array(daysCount).fill(""),
    }));

    replace(newRows);
  }, [schedule, tab, isEdit]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} id={formId}>
        <Table className="table-fixed">
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
              remove={remove}
              move={move}
              update={update}
            />
          )}

          <ScheduleTableFooter shiftCounts={shiftCounts} role={tab as string} />
        </Table>
      </form>
    </Form>
  );
}
