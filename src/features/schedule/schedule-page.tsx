"use client";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import ScheduleTableFooter from "./schedule-footer";
import ScheduleTableHeader from "./schedule-header";
import ScheduleTableBody from "./schedule-body";
import {
  createSchedule,
  ScheduleData,
  SchedulesContextValue,
  updateSchedule,
} from "@/app/actions/schedule/schedule-action";
import { ValueParams } from "@/types/params";
import { useEffect, useState } from "react";
import { useHashParam } from "@/hooks/use-hash";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultSchedule, scheduleSchema, ScheduleType } from "./schema";
import { Form } from "@/components/ui/form";
import {
  calculateShiftTotals,
  getSelectedEmployeesByRole,
  getShiftCounts,
} from "./utils";
import { EMPLOYEE_ROLES_BY_DEPARTMENT } from "./constants";
import { toast } from "sonner";
import { getMonthDays } from "@/utils/get-month-days";
import ScheduleCreateTableBody from "./schedule-create-body";

export default function SchedulePage({
  schedules,
  params,
}: {
  schedules: SchedulesContextValue[] | null;
  params: ValueParams;
}) {
  const [tab] = useHashParam("tab");
  const { month, year } = params;

  const schedule = schedules?.find((s: any) => s.role === tab) ?? null;

  // state
  const [selectedDay, setSelectedDay] = useState<string>("0");
  const [isEdit, setIsEdit] = useState(false);

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
  const { monthDays } = getMonthDays({ month, year });

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
        shifts: Array(monthDays.length).fill(""),
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
      shifts: Array(monthDays.length).fill(""),
    }));

    replace(newRows);
  }, [schedule, tab, isEdit]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Table className="table-fixed">
          <ScheduleTableHeader
            month={month as string}
            addNewRow={addRow}
            monthDays={monthDays}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            setIsEdit={setIsEdit}
            isEdit={isEdit}
            tab={tab as string}
          />
          {!isEdit ? (
            <ScheduleTableBody
              schedule={schedule}
              selectedDay={selectedDay}
              monthDays={monthDays}
            />
          ) : (
            <ScheduleCreateTableBody
              fields={fields}
              selectedEmployees={selectedEmployees}
              remove={remove}
              move={move}
              update={update}
            />
          )}
          <TableBody className="border-t">
            <TableRow>
              <TableCell colSpan={7} />
              {monthDays
                ?.filter((_, index) =>
                  !selectedDay || selectedDay === "0"
                    ? true
                    : Number(selectedDay) === index + 1,
                )
                .map((day) => (
                  <TableCell key={day.day} className={"w-9 cursor-pointer"}>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs text-muted-foreground">
                        {day.weekday}
                      </span>
                      <span className="text-sm font-semibold">{day.day}</span>
                    </div>
                  </TableCell>
                ))}
            </TableRow>
          </TableBody>
          <ScheduleTableFooter shiftCounts={shiftCounts} role={tab as string} />
        </Table>
      </form>
    </Form>
  );
}
