"use client";
import { useEffect } from "react";
import { Table } from "@/components/ui/table";
import {
  Resolver,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";

import {
  createSchedule,
  ScheduleData,
  SchedulesContextValue,
  updateSchedule,
} from "@/app/actions/schedule/scheduleAction";
import { getMonthDays } from "@/utils/getMonthDays";
import { toast } from "sonner";
import { defaultSchedule, scheduleSchema, ScheduleType } from "./schema";
import { EMPLOYEE_ROLES_BY_DEPARTMENT } from "./constants";
import { FormWrapper } from "@/components/wrapper/form-wrapper";
import ScheduleTableHeader from "../ScheduleTableHeader";
import ScheduleCreateTableBody from "./ScheduleCreateTableBody";
import { getSelectedEmployeesByRole } from "../utils";
import ScheduleTableFooter from "../ScheduleTableFooter";
import { zodResolver } from "@hookform/resolvers/zod";

export function ScheduleCreatePage({
  schedule,
  patch,
  month,
  year,
}: {
  schedule?: SchedulesContextValue;
  patch: string;
  month: string;
  year: string;
}) {
  const found = schedule
    ? schedule
    : {
        ...defaultSchedule,
        role: patch,
        month: month as string,
        year: year as string,
      };

  // set form
  const form = useForm<ScheduleType>({
    resolver: zodResolver(scheduleSchema) as Resolver<ScheduleType>,
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
    if (schedule?.id) {
      await updateSchedule(schedule.id as string, formatData);
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
  }, [month, patch, selectedEmployees, monthDays.length, fields.length]);

  return (
    <FormWrapper form={form} onSubmit={onSubmit} withButtons={false}>
      <Table>
        <ScheduleTableHeader
          addNewRow={addRow}
          isSave={true}
          monthDays={monthDays}
          month={month}
        />

        <ScheduleCreateTableBody
          fields={fields}
          monthDays={monthDays}
          selectedEmployees={selectedEmployees}
          remove={remove}
          move={move}
        />

        <ScheduleTableFooter schedule={form.watch() as any} />
      </Table>
    </FormWrapper>
  );
}
