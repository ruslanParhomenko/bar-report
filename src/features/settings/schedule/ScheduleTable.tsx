"use client";
import { useEffect, useMemo } from "react";
import { Table } from "@/components/ui/table";
import {
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { Form } from "@/components/ui/form";
import { defaultSchedule, scheduleSchema, ScheduleType } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import ScheduleSelectButtons from "./ScheduleSelectButtons";
import ScheduleHeader from "./ScheduleHeader";
import ScheduleBody from "./ScheduleBody";
import ScheduleFooter from "./ScheduleFooter";
import {
  createSchedule,
  ScheduleData,
  updateSchedule,
} from "@/app/actions/schedule/scheduleAction";
import { getMonthDays } from "@/utils/getMonthDays";
import { useSchedules } from "@/providers/ScheduleProvider";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { EMPLOYEE_ROLES_BY_DEPARTMENT, SHIFT_OPTIONS } from "./constants";
import { useEmployees } from "@/providers/EmployeesProvider";
import { useLocalStorageForm } from "@/hooks/use-local-storage";

export function ScheduleTable() {
  const { id } = useParams();
  const router = useRouter();

  // set schedule
  const schedules = useSchedules();
  const found = schedules.find((s) => s.id === id);

  // set form
  const form = useForm<ScheduleType>({
    resolver: yupResolver(scheduleSchema) as any,
    defaultValues: found || defaultSchedule,
  });
  const { fields, remove, replace, move } = useFieldArray({
    control: form.control,
    name: "rowShifts",
  });

  const month = form.watch("month");
  const role = form.watch("role");
  const year = form.watch("year");

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
  }, [employees, role]);

  // set days
  const monthDays = useMemo(() => {
    if (!month || !year) return [];
    return getMonthDays({ month, year });
  }, [month, year]);

  // set storage
  const storageKey = useMemo(() => {
    if (!month || !role || !year) return "";
    return `schedule_${year}_${month}_${role}`;
  }, [year, month, role]);

  // local storage
  const { setValue, removeValue, getValue } =
    useLocalStorageForm<Omit<ScheduleType, "id">>(storageKey);

  // submit
  const onSubmit: SubmitHandler<ScheduleType> = async (data) => {
    console.log("data submit", data);
    const formatData: ScheduleData = {
      ...data,
      uniqueKey: `${data.year}-${data.month}-${data.role}`,
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

  // set fields
  useEffect(() => {
    if (!month || !role || selectedEmployees.length === 0) return;
    if (!storageKey) return;
    if (id) return;

    const savedData = getValue();

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

    if (savedData) {
      form.reset(savedData);
    } else {
      replace(newRows);
    }
  }, [month, role, selectedEmployees, monthDays.length]);

  //update local storage
  const watchAll = useWatch({ control: form.control });
  useEffect(() => {
    if (!storageKey) return;
    if (id) return;
    setValue(watchAll as Omit<ScheduleType, "id">);
  }, [watchAll, storageKey]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        className="flex flex-col"
      >
        <ScheduleSelectButtons remove={removeValue} />

        <Table className="md:table-fixed">
          {month && <ScheduleHeader monthDays={monthDays} addNewRow={addRow} />}

          <ScheduleBody
            fields={fields}
            monthDays={monthDays}
            selectedEmployees={selectedEmployees}
            remove={remove}
            move={move}
          />

          {role && <ScheduleFooter data={SHIFT_OPTIONS || []} />}
        </Table>
      </form>
    </Form>
  );
}
