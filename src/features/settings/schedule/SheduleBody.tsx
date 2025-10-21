"use client";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
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
import SelectSheduleShifts from "@/components/inputs/SelectSheduleShifts";
import { cn } from "@/lib/utils";

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
      dayHours: "",
      nightHours: "",
      totalHours: "",
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
        dayHours: "",
        nightHours: "",
        totalHours: "",
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

  const color = {
    "8": "blue",
    "9": "blue",
    "14": "green",
    "18": "black",
    "20": "black",
  } as const;

  return (
    <TableBody>
      {fields.map((row, rowIndex) => (
        <TableRow key={row.id} className="hover:text-rd">
          <TableCell
            className="border-0 text-rd cursor-pointer w-4"
            onClick={() => remove(rowIndex)}
          >
            {rowIndex + 1}
          </TableCell>

          <TableCell className="border-0 text-bl">
            <input
              {...form.register(`rowShifts.${rowIndex}.dayHours`)}
              className="border-0 text-center  text-xs w-5  p-0"
              readOnly
            />{" "}
            :
            <input
              {...form.register(`rowShifts.${rowIndex}.nightHours`)}
              className="border-0 text-center text-xs w-5 p-0"
              readOnly
            />
          </TableCell>

          <TableCell className="border-0">
            <input
              {...form.register(`rowShifts.${rowIndex}.totalHours`)}
              className="border-0 text-center w-10 p-0 font-bold"
              readOnly
            />
          </TableCell>

          <TableCell className="border-0 flex justify-between items-center gap-1 w-full sticky left-0">
            <SelectField
              fieldName={`rowShifts.${rowIndex}.employee`}
              data={selectedEmployees}
              className="w-34 px-2 hover:text-rd"
            />
          </TableCell>
          <TableCell
            className="border-0 w-4 p-0 cursor-pointer"
            onClick={() => resetRow(rowIndex)}
          >
            <RotateCcw className="w-4 p-0" />
          </TableCell>

          {monthDays.map((_day, dayIndex) => {
            const fieldName = `rowShifts.${rowIndex}.shifts.${dayIndex}`;
            const value = form.getValues(fieldName);

            console.log(fieldName, value);
            return (
              <TableCell key={dayIndex} className="border-0">
                <SelectSheduleShifts
                  fieldName={`rowShifts.${rowIndex}.shifts.${dayIndex}`}
                  data={SHIFT_OPTIONS}
                  className={cn(
                    "w-9 p-0 cursor-pointer",
                    value === null ? "bg-border" : "text-bl"
                  )}
                  style={{ color: color[value as keyof typeof color] }}
                />
              </TableCell>
            );
          })}
          <TableCell className="w-6 flex flex-col justify-center items-center">
            <Button
              type="button"
              variant="ghost"
              disabled={rowIndex === 0}
              onClick={() => move(rowIndex, rowIndex - 1)}
              className="w-4 h-4 cursor-pointer flex flex-col items-center justify-center"
            >
              <ChevronUp className="w-3 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={rowIndex === fields.length - 1}
              onClick={() => move(rowIndex, rowIndex + 1)}
              className="w-4 h-4 cursor-pointer flex flex-col items-center justify-center"
            >
              <ChevronDown className="w-3 h-4" />
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
