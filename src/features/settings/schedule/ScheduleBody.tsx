"use client";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEmployees } from "@/providers/EmployeesProvider";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { getMonthDays } from "@/utils/getMonthDays";
import { cn } from "@/lib/utils";

import SelectScheduleEmployee from "@/components/inputs/SelectScheduleEmployee";

import {
  EMPLOYEE_ROLES_BY_DEPARTMENT,
  SHIFT_HOURS_MAP_DAY,
  SHIFT_HOURS_MAP_NIGHT,
} from "../constants";

export default function ScheduleBody() {
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

  useEffect(() => {
    if (!month || !role || selectedEmployees.length === 0) return;
    if (!storageKey) return;

    const savedData = localStorage.getItem(storageKey);

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
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData?.rowShifts?.length > 0) {
          form.reset(parsedData);
          return;
        }
      } catch (e) {
        console.log(e);
      }
    }

    replace(newRows);

    const dataToSave = { year, month, role, rowShifts: newRows };
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
              sum + (SHIFT_HOURS_MAP_DAY?.[val] ?? 0),
            0
          );
          const totalHoursNight = shifts.reduce(
            (sum: number, val: string) =>
              sum + (SHIFT_HOURS_MAP_NIGHT?.[val] ?? 0),
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

    const updatedData = { ...currentData, rowShifts: updatedRows };
    form.reset(updatedData);
    if (storageKey)
      localStorage.setItem(storageKey, JSON.stringify(updatedData));
  };

  const color = {
    "8": "blue",
    "9": "blue",
    "14": "green",
    "18": "black",
    "20": "black",
  } as const;

  return (
    <TableBody className="[&_input]:h-6 [&_input]:text-xs [&_input]:p-0 [&_input]:text-center [&_input]:w-6 [&_input]:border-0">
      {fields.map((row, rowIndex) => (
        <TableRow key={row.id} className="hover:text-rd p-0">
          <TableCell
            className="text-rd cursor-pointer w-3 p-0"
            onClick={() => remove(rowIndex)}
          >
            {rowIndex + 1}
          </TableCell>

          <TableCell className="text-bl p-0">
            <input
              {...form.register(`rowShifts.${rowIndex}.dayHours`)}
              readOnly
            />{" "}
            :
            <input
              {...form.register(`rowShifts.${rowIndex}.nightHours`)}
              readOnly
            />
          </TableCell>

          <TableCell className="p-0 text-center">
            <input
              {...form.register(`rowShifts.${rowIndex}.totalHours`)}
              className="font-bold"
              readOnly
            />
          </TableCell>

          <TableCell className="sticky left-0 p-0">
            <SelectScheduleEmployee
              fieldName={`rowShifts.${rowIndex}.employee`}
              data={selectedEmployees}
              className="w-33 px-1 hover:text-rd justify-start"
            />
          </TableCell>

          <TableCell
            className="w-2 cursor-pointer p-0"
            onClick={() => resetRow(rowIndex)}
          >
            X
          </TableCell>

          {monthDays.map((_day, dayIndex) => {
            const fieldName = `rowShifts.${rowIndex}.shifts.${dayIndex}`;
            const value = form.getValues(fieldName);

            return (
              <TableCell key={dayIndex} className="p-0 text-center">
                <input
                  {...form.register(fieldName)}
                  className={cn("w-9", value === "" ? "bg-border" : "text-bl")}
                  style={{ color: color[value as keyof typeof color] }}
                />
              </TableCell>
            );
          })}

          <TableCell className="w-6 flex flex-col justify-center items-center p-0">
            <Button
              type="button"
              variant="ghost"
              disabled={rowIndex === 0}
              onClick={() => move(rowIndex, rowIndex - 1)}
              className="w-3 h-3 p-0 flex items-center justify-center"
            >
              <ChevronUp className="w-2 h-3" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={rowIndex === fields.length - 1}
              onClick={() => move(rowIndex, rowIndex + 1)}
              className="w-3 h-3 p-0 flex items-center justify-center"
            >
              <ChevronDown className="w-2 h-3" />
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
