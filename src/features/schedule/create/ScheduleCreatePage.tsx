"use client";
import { useEffect } from "react";
import { Table } from "@/components/ui/table";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  createSchedule,
  ScheduleData,
  updateSchedule,
} from "@/app/actions/schedule/scheduleAction";
import { getMonthDays } from "@/utils/getMonthDays";
import { useSchedules } from "@/providers/ScheduleProvider";
import { toast } from "sonner";
import { defaultSchedule, scheduleSchema, ScheduleType } from "./schema";
import { EMPLOYEE_ROLES_BY_DEPARTMENT } from "./constants";
import { FormWrapper } from "@/components/wrapper/FormWrapper";
import ScheduleTableHeader from "../ScheduleTableHeader";
import ScheduleCreateTableBody from "./ScheduleCreateTableBody";
import { getSelectedEmployeesByRole } from "../utils";
import ScheduleTableFooter from "../ScheduleTableFooter";

export function ScheduleCreatePage({
  id,
  patch,
  month,
  year,
}: {
  id?: string;
  patch: string;
  month: string;
  year: string;
}) {
  // set schedule
  const schedules = useSchedules();
  const found = id ? schedules.find((s) => s.id === id) : defaultSchedule;

  // set form
  const form = useForm<ScheduleType>({
    resolver: yupResolver(scheduleSchema),
    defaultValues: found,
  });
  const { fields, remove, replace, move } = useFieldArray({
    control: form.control,
    name: "rowShifts",
  });

  // set employees
  const selectedEmployees = getSelectedEmployeesByRole(
    patch as keyof typeof EMPLOYEE_ROLES_BY_DEPARTMENT
  );

  // set days
  const monthDays = getMonthDays({ month, year });

  // submit
  const onSubmit: SubmitHandler<ScheduleType> = async (data) => {
    const formatData: ScheduleData = {
      ...data,
      uniqueKey: `${year}-${month}-${patch}`,
      month: month as string,
      year: year as string,
      role: patch as string,
    };
    if (id) {
      await updateSchedule(id as string, formatData);
      toast.success("График успешно обновлён!");
      return;
    } else {
      await createSchedule(formatData);
      toast.success("График успешно создан!");
      form.reset(defaultSchedule);
      return;
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
    if (id) return;
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
  }, [month, patch, selectedEmployees, monthDays.length, fields.length]);

  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      {/* <ScheduleCreateActionForm /> */}

      <Table className="md:table-fixed">
        <ScheduleTableHeader addNewRow={addRow} isSave={true} patch={patch} />

        <ScheduleCreateTableBody
          fields={fields}
          monthDays={monthDays}
          selectedEmployees={selectedEmployees}
          remove={remove}
          move={move}
        />

        <ScheduleTableFooter schedule={form.watch() as any} id={id} />
      </Table>
    </FormWrapper>
  );
}
