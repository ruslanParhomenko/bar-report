"use client";
import { useEffect } from "react";
import { Table } from "@/components/ui/table";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";

import {
  createSchedule,
  ScheduleData,
  SchedulesContextValue,
  updateSchedule,
} from "@/app/actions/schedule/schedule-action";
import { getMonthDays } from "@/utils/get-month-days";
import { toast } from "sonner";
import { defaultSchedule, scheduleSchema, ScheduleType } from "./schema";
import { EMPLOYEE_ROLES_BY_DEPARTMENT } from "./constants";
import ScheduleTableHeader from "../schedule-header";
import ScheduleCreateTableBody from "./schedule-form-body";
import { getSelectedEmployeesByRole } from "../utils";
import ScheduleTableFooter from "../schedule-footer";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/wrapper/form";
import { useRouter } from "next/navigation";
import { ValueParams } from "@/types/params";
import { calculateShiftTotals } from "./utils";
import { useHashParam } from "@/hooks/use-hash";

export function ScheduleCreatePage({
  schedule,
  params,
}: {
  schedule?: SchedulesContextValue;
  params: ValueParams;
}) {
  const [tab] = useHashParam("tab");

  const { month, year } = params;
  const router = useRouter();

  // set form
  const form = useForm<ScheduleType>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: schedule ?? defaultSchedule,
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
  const monthDays = getMonthDays({ month, year });

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
      router.back();
    } else {
      await createSchedule(formatData);
      toast.success("График успешно создан!");
      form.reset(defaultSchedule);
      router.back();
    }
  };
  // add new row
  const addRow = () => {
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
  };

  useEffect(() => {
    if (schedule?.id) return;
    if (fields.length > 0) return;

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
  }, [month, tab, selectedEmployees, monthDays.length, fields.length]);

  if (!tab) return null;

  return (
    <FormInput form={form} onSubmit={onSubmit}>
      <Table className="table-fixed">
        <ScheduleTableHeader
          addNewRow={addRow}
          isSave={true}
          params={params}
          tab={tab}
        />

        <ScheduleCreateTableBody
          fields={fields}
          selectedEmployees={selectedEmployees}
          remove={remove}
          move={move}
          update={update}
        />

        <ScheduleTableFooter schedule={form.watch("rowShifts")} role={tab} />
      </Table>
    </FormInput>
  );
}
