"use client";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { RotateCcw, Trash2 } from "lucide-react";
import SelectField from "@/components/inputs/SelectField";
import {
  EMPLOYEE_ROLES_BY_DEPARTMENT,
  SHIFT_HOURS_MAP_DAY,
  SHIFT_HOURS_MAP_NIGHT,
  SHIFT_OPTIONS,
} from "../constants";
import { useEmployees } from "@/providers/EmployeesProvider";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { getMonthDays } from "@/utils/getMonthDays";

export default function SheduleBody() {
  const employees = useEmployees();

  const form = useFormContext();

  const { fields, remove, replace, move } = useFieldArray({
    control: form.control,
    name: "rowShifts",
  });

  const year = form.watch("year");
  const role = form.watch("role");
  const month = form.watch("month");

  const monthDays = useMemo(() => {
    if (!month || !year) return [];
    return getMonthDays({ month, year });
  }, [month, year]);

  const storageKey = useMemo(() => {
    if (!month || !role || !year) return null;
    return `schedule_${year}_${month}_${role}`;
  }, [year, month, role]);

  const selectedEmployees = useMemo(() => {
    if (
      !Array.isArray(employees) ||
      !role ||
      !(role in EMPLOYEE_ROLES_BY_DEPARTMENT)
    )
      return [];

    const allowedRoles = EMPLOYEE_ROLES_BY_DEPARTMENT[
      role as keyof typeof EMPLOYEE_ROLES_BY_DEPARTMENT
    ] as readonly string[];

    return employees
      .filter((e) => allowedRoles.includes(e.role))
      .sort((a, b) => {
        const roleA = allowedRoles.indexOf(a.role);
        const roleB = allowedRoles.indexOf(b.role);
        if (roleA !== roleB) return roleA - roleB;
        return a.name.localeCompare(b.name);
      })
      .map((e) => e.name);
  }, [employees, role]);

  useEffect(() => {
    if (!month || !role || selectedEmployees.length === 0) return;
    if (!storageKey) return;

    const savedData = localStorage.getItem(storageKey);

    const newRows = selectedEmployees.map((employee, index) => ({
      id: `${Date.now()}-${index}`,
      number: index + 1,
      dayHours: 0,
      nightHours: 0,
      totalHours: 0,
      employee,
      shifts: Array(monthDays.length).fill(null),
    }));

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);

        if (parsedData?.rowShifts?.length > 0) {
          form.reset(parsedData);
          return;
        }
      } catch (e) {
        console.error("Ошибка парсинга localStorage:", e);
      }
    }

    replace(newRows);

    const dataToSave = {
      year,
      month,
      role,
      rowShifts: newRows,
    };
    localStorage.setItem(storageKey, JSON.stringify(dataToSave));
  }, [month, role, selectedEmployees, monthDays.length]);

  useEffect(() => {
    const subscription = form.watch((_, { name }) => {
      if (name?.includes("shifts")) {
        const match = name.match(/rowShifts\.(\d+)\.shifts/);
        if (match) {
          const rowIndex = parseInt(match[1]);
          const shifts = form.getValues(`rowShifts.${rowIndex}.shifts`) || [];

          const totalHoursDay = shifts.reduce(
            (sum: number, val: string) =>
              sum + (SHIFT_HOURS_MAP_DAY?.[val as string] ?? 0),
            0
          );
          const totalHoursNight = shifts.reduce(
            (sum: number, val: string) =>
              sum + (SHIFT_HOURS_MAP_NIGHT[val as string] ?? 0),
            0
          );

          form.setValue(`rowShifts.${rowIndex}.dayHours`, totalHoursDay);
          form.setValue(`rowShifts.${rowIndex}.nightHours`, totalHoursNight);
          form.setValue(
            `rowShifts.${rowIndex}.totalHours`,
            totalHoursDay + totalHoursNight
          );
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const watchAll = useWatch({ control: form.control });
  useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(watchAll));
  }, [watchAll, storageKey]);

  const resetRow = (rowIndex: number) => {
    const currentData = form.getValues();
    const updatedRows = currentData.rowShifts.map((row: any, index: number) => {
      if (index !== rowIndex) return row;

      return {
        ...row,
        shifts: row.shifts.map(() => ""),
        dayHours: 0,
        nightHours: 0,
        totalHours: 0,
      };
    });

    const updatedData = {
      ...currentData,
      rowShifts: updatedRows,
    };

    form.reset(updatedData);

    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(updatedData));
    }
  };

  return (
    <TableBody>
      {fields.map((row, rowIndex) => (
        <TableRow key={row.id} className="hover:bg-muted/50">
          <TableCell className="border-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-6 text-rd cursor-pointer"
              onClick={() => remove(rowIndex)}
            >
              <Trash2 />
              {rowIndex + 1}
            </Button>
          </TableCell>

          <TableCell className="border-0">
            <input
              {...form.register(`rowShifts.${rowIndex}.dayHours`)}
              className="border-0 text-center w-6 p-0"
              readOnly
            />
          </TableCell>

          <TableCell className="border-0">
            <input
              {...form.register(`rowShifts.${rowIndex}.nightHours`)}
              className="border-0 text-center w-6 p-0"
              readOnly
            />
          </TableCell>

          <TableCell className="border-0">
            <input
              {...form.register(`rowShifts.${rowIndex}.totalHours`)}
              className="border-0 text-center w-8 p-0 font-bold"
              readOnly
            />
          </TableCell>

          <TableCell className="border-0 flex justify-between items-center gap-1 w-full">
            <div className="flex flex-col">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={rowIndex === 0}
                onClick={() => move(rowIndex, rowIndex - 1)}
                className="w-2 h-2"
              >
                +
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={rowIndex === fields.length - 1}
                onClick={() => move(rowIndex, rowIndex + 1)}
                className="w-2 h-2"
              >
                -
              </Button>
            </div>

            <SelectField
              fieldName={`rowShifts.${rowIndex}.employee`}
              data={selectedEmployees}
              className="w-36 px-2"
            />
            <Button
              variant="ghost"
              size="sm"
              type="button"
              className="w-2"
              onClick={() => resetRow(rowIndex)}
            >
              <RotateCcw className="w-2 h-2" />
            </Button>
          </TableCell>

          {monthDays.map((_day, dayIndex) => (
            <TableCell key={dayIndex} className="border-0">
              <SelectField
                fieldName={`rowShifts.${rowIndex}.shifts.${dayIndex}`}
                data={SHIFT_OPTIONS}
                className="w-7 p-0 cursor-pointer"
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
