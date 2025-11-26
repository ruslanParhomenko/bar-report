"use client";
import { useEffect, useMemo } from "react";
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
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";

import { useEmployees } from "@/providers/EmployeesProvider";
import { defaultSchedule, scheduleSchema, ScheduleType } from "./schema";
import { EMPLOYEE_ROLES_BY_DEPARTMENT, SHIFT_OPTIONS } from "./constants";
import { useLocalStorageForm } from "@/hooks/useLocalStorageForm";
import { FormWrapper } from "@/components/wrapper/FormWrapper";
import ScheduleTableHeader from "../ScheduleTableHeader";
import ScheduleCreateTableBody from "./ScheduleCreateTableBody";
import ScheduleCreateTableFooter from "./ScheduleCreateTableFooter";
import ScheduleCreateActionForm from "./ScheduleCreateActionForm";

export function ScheduleCreatePage() {
  const { id, patch }: { id: string; patch: string } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const month = searchParams.get("month");
  const year = searchParams.get("year");
  const role = patch as keyof typeof EMPLOYEE_ROLES_BY_DEPARTMENT;

  // set schedule
  const schedules = useSchedules();
  const found = id
    ? schedules.find((s) => s.uniqueKey === id)
    : defaultSchedule;

  console.log("found", found);

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
  const employees = useEmployees();
  const selectedEmployees = useMemo(() => {
    if (
      !Array.isArray(employees) ||
      !role ||
      !(role in EMPLOYEE_ROLES_BY_DEPARTMENT)
    )
      return [];

    const allowedRoles: readonly string[] =
      EMPLOYEE_ROLES_BY_DEPARTMENT[
        role as keyof typeof EMPLOYEE_ROLES_BY_DEPARTMENT
      ] ?? [];

    return employees
      .filter((e) => allowedRoles.includes(e.role))
      .sort((a, b) => {
        const roleA = allowedRoles.indexOf(a.role);
        const roleB = allowedRoles.indexOf(b.role);
        if (roleA !== roleB) return roleA - roleB;
        return a.name.localeCompare(b.name);
      });
  }, [employees, patch]);

  // set days
  const monthDays = useMemo(() => {
    if (!month || !year) return [];
    return getMonthDays({ month, year });
  }, [month, year]);

  // set storage
  const storageKey = useMemo(() => {
    if (!month || !role || !year) return "";
    return `schedule_${year}_${month}_${role}_${id ? "update" : "create"}`;
  }, [year, month, patch]);

  // local storage
  const { isLoaded, removeLocalStorageKey } = useLocalStorageForm(
    form,
    storageKey
  );

  // submit
  const onSubmit: SubmitHandler<ScheduleType> = async (data) => {
    console.log("data", data);
    const formatData: ScheduleData = {
      ...data,
      uniqueKey: `${year}-${month}-${role}`,
      month: month as string,
      year: year as string,
      role: role as string,
    };
    const existing = schedules?.find(
      (s) => s.uniqueKey === formatData.uniqueKey
    );
    if (id) {
      await updateSchedule(id as string, formatData);
      toast.success("График успешно обновлён!");
      router.back();
      return;
    }
    if (!id && !existing) {
      await createSchedule(formatData);
      toast.success("График успешно создан!");
      form.reset(defaultSchedule);
      return;
    }
    toast.error(
      "График с такими параметрами уже существует или некорректные данные!"
    );
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
    if (!isLoaded) return;
    if (id) return;
    if (!month || !role || selectedEmployees.length === 0) return;
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
  }, [
    isLoaded,
    month,
    role,
    selectedEmployees,
    monthDays.length,
    fields.length,
  ]);

  if (!isLoaded) return null;
  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <ScheduleCreateActionForm removeLocalStorageKey={removeLocalStorageKey} />

      <Table className="md:table-fixed">
        <ScheduleTableHeader addNewRow={addRow} isCreate={true} />

        <ScheduleCreateTableBody
          fields={fields}
          monthDays={monthDays}
          selectedEmployees={selectedEmployees}
          remove={remove}
          move={move}
        />

        <ScheduleCreateTableFooter data={SHIFT_OPTIONS || []} />
      </Table>
    </FormWrapper>
  );
}
