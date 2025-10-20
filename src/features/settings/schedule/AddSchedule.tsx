"use client";

import { useEffect, useMemo } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, RotateCcw, Trash2 } from "lucide-react";
import { useEmployees } from "@/providers/EmployeesProvider";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { Form } from "@/components/ui/form";
import SelectField from "@/components/inputs/SelectField";
import { YearPicker } from "@/components/inputs/YearPicker";
import {
  MONTHS,
  SHIFT_HOURS_MAP_DAY,
  SHIFT_HOURS_MAP_NIGHT,
  SHIFT_OPTIONS,
} from "../constants";
import { useTranslations } from "next-intl";

const EMPLOYEE_ROLES_BY_DEPARTMENT = {
  restaurant: ["barmen", "waiters", "mngr"],
  cucina: ["cook"],
  dish: ["dish"],
} as const;
export const ROLE_EMPLOYEES = ["restaurant", "cucina", "dish"];

interface ShiftRow {
  id: string;
  number: number;
  dayHours: number;
  nightHours: number;
  totalHours: number;
  employee: string;
  shifts: (string | null)[];
}

export function ScheduleTable() {
  const LOCAL_STORAGE_KEY = "schedule";
  const t = useTranslations("Home");
  const employees = useEmployees();

  //localstorage
  const savedData =
    typeof window !== "undefined"
      ? localStorage.getItem(LOCAL_STORAGE_KEY)
      : null;
  const parsedSavedData = savedData ? JSON.parse(savedData) : null;

  console.log(parsedSavedData);

  const form = useForm({
    defaultValues: parsedSavedData || {
      year: "",
      month: "",
      role: "",
      rowShifts: [] as ShiftRow[],
    },
  });

  const { fields, append, remove, update, replace, move } = useFieldArray({
    control: form.control,
    name: "rowShifts",
  });

  const month = form.watch("month");
  const year = form.watch("year");
  const role = form.watch("role");
  const selectedEmployees = useMemo(() => {
    if (
      !Array.isArray(employees) ||
      !role ||
      !(role in EMPLOYEE_ROLES_BY_DEPARTMENT)
    ) {
      return [];
    }

    const allowedRoles = EMPLOYEE_ROLES_BY_DEPARTMENT[
      role as keyof typeof EMPLOYEE_ROLES_BY_DEPARTMENT
    ] as readonly string[];

    return employees
      .filter((employee) => allowedRoles.includes(employee.role))
      .sort((a, b) => {
        const roleOrderA = allowedRoles.indexOf(a.role);
        const roleOrderB = allowedRoles.indexOf(b.role);
        if (roleOrderA !== roleOrderB) {
          return roleOrderA - roleOrderB;
        }
        return a.name.localeCompare(b.name);
      })
      .map((employee) => employee.name);
  }, [employees, role]);

  const getMonthDays = () => {
    if (!month) return [];

    // Определяем индекс месяца из массива MONTHS
    const monthIndex = MONTHS.findIndex(
      (m) => m.toLowerCase() === month.toLowerCase()
    );
    if (monthIndex < 0) return [];

    const daysInMonth = new Date(Number(year), monthIndex + 1, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(Number(year), monthIndex, i + 1);
      return {
        day: i + 1,
        weekday: date
          .toLocaleDateString("ru-RU", { weekday: "short" })
          .replace(".", ""), // убираем точку в "пн.", "вт."
      };
    });
  };

  const monthDays = getMonthDays();

  console.log(monthDays);

  const updateRowHours = (rowIndex: number) => {
    const shifts = form.getValues(`rowShifts.${rowIndex}.shifts`) || [];

    const totalHoursDay = shifts.reduce(
      (sum: number, val: string) =>
        sum + (SHIFT_HOURS_MAP_DAY[val as string] ?? 0),
      0
    );

    const totalHoursNight = shifts.reduce(
      (sum: number, val: string) =>
        sum + (SHIFT_HOURS_MAP_NIGHT[val as string] ?? 0),
      0
    );

    const totalHours = totalHoursDay + totalHoursNight;

    form.setValue(`rowShifts.${rowIndex}.dayHours`, totalHoursDay);
    form.setValue(`rowShifts.${rowIndex}.nightHours`, totalHoursNight);
    form.setValue(`rowShifts.${rowIndex}.totalHours`, totalHours);
  };

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name?.includes("shifts")) {
        const match = name.match(/rowShifts\.(\d+)\.shifts/);
        if (match) {
          const rowIndex = parseInt(match[1]);
          updateRowHours(rowIndex);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);
  const addNewRow = () => {
    const newRow: ShiftRow = {
      id: Date.now().toString(),
      number: fields.length + 1,
      dayHours: 0,
      nightHours: 0,
      totalHours: 0,
      employee: "",
      shifts: Array(monthDays.length).fill(null),
    };
    append(newRow);
  };

  const removeRow = (index: number) => {
    remove(index);
  };

  const resetForm = () => {
    form.reset({
      year: "",
      month: "",
      role: "",
      rowShifts: [],
    });
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const onSubmit = (data: any) => {
    console.log(data);
  };

  useEffect(() => {
    if (month && role) {
      const newRows = selectedEmployees.map((employee, index) => ({
        id: `${Date.now()}-${index}`,
        number: index + 1,
        dayHours: 0,
        nightHours: 0,
        totalHours: 0,
        employee,
        shifts: Array(monthDays.length).fill(null),
      }));
      replace(newRows);
    } else {
      replace([]);
    }
  }, [month, role, selectedEmployees.length]);

  const watchAllFields = useWatch({
    control: form.control,
  });

  //set local
  useEffect(() => {
    if (!watchAllFields) return;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(watchAllFields));
  }, [watchAllFields]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        <div className="p-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <SelectField
              fieldName="role"
              data={ROLE_EMPLOYEES}
              placeHolder="role"
              className="w-50"
            />
            <SelectField
              fieldName="month"
              data={MONTHS}
              placeHolder="month"
              className="w-50"
            />
            <YearPicker name="year" />
          </div>
          <div className="flex gap-2">
            <Button onClick={addNewRow} size="sm" type="button">
              <Plus className="h-4 w-4 mr-2" />
              {t("add")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={resetForm}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              {t("reset")}
            </Button>
          </div>
        </div>

        <Table className="table-fixed w-[99%]">
          <TableBody>
            <TableRow>
              <TableCell className="w-6"></TableCell>
              <TableCell className="w-6"></TableCell>
              <TableCell className="w-6"></TableCell>
              <TableCell className="w-8"></TableCell>
              <TableCell className="w-34"></TableCell>

              {monthDays.map((day) => (
                <TableCell
                  key={day.day}
                  className={"w-8 text-center cursor-pointer"}
                >
                  <div className="text-sm font-semibold">{day.day}</div>
                  <div className="text-xs text-muted-foreground">
                    {day.weekday}
                  </div>
                </TableCell>
              ))}
            </TableRow>

            {fields.map((row, rowIndex) => (
              <TableRow key={row.id} className="hover:bg-muted/50">
                <TableCell className="border-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-6 text-rd cursor-pointer"
                    onClick={() => removeRow(rowIndex)}
                  >
                    <Trash2 />
                    {rowIndex + 1}
                  </Button>
                </TableCell>

                <TableCell className="border-0">
                  <input
                    {...form.register(`rowShifts.${rowIndex}.dayHours`)}
                    className="border-0 text-center w-6 p-0 text-bl"
                    readOnly
                  />
                </TableCell>

                <TableCell className="border-0">
                  <input
                    {...form.register(`rowShifts.${rowIndex}.nightHours`)}
                    className="border-0 text-center w-6 p-0 text-bl"
                    readOnly
                  />
                </TableCell>

                <TableCell className="border-0">
                  <input
                    {...form.register(`rowShifts.${rowIndex}.totalHours`)}
                    className="border-0 text-center w-8 p-0 text-bl font-bold"
                    readOnly
                  />
                </TableCell>

                {/* 🔽 Здесь добавляем стрелки вверх/вниз + SelectField */}
                <TableCell className="border-0 flex items-center gap-1">
                  <div className="flex flex-col">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={rowIndex === 0}
                      onClick={() => move(rowIndex, rowIndex - 1)}
                      className="w-3 pr-1 h-3 cursor-pointer hover:text-rd"
                    >
                      +
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={rowIndex === fields.length - 1}
                      onClick={() => move(rowIndex, rowIndex + 1)}
                      className="w-3 pr-1 h-3 cursor-pointer hover:text-rd"
                    >
                      -
                    </Button>
                  </div>
                  <SelectField
                    fieldName={`rowShifts.${rowIndex}.employee`}
                    data={selectedEmployees}
                    className="w-32 p-0"
                  />
                </TableCell>

                {monthDays.map((_day, dayIndex) => (
                  <TableCell key={dayIndex} className={"border-0"}>
                    <SelectField
                      fieldName={`rowShifts.${rowIndex}.shifts.${dayIndex}`}
                      data={SHIFT_OPTIONS}
                      className="w-8 p-0 cursor-pointer"
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button type="submit" className="self-end mt-4">
          {t("save")}
        </Button>
      </form>
    </Form>
  );
}
