"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp, Minus } from "lucide-react";
import {
  FieldArrayWithId,
  UseFieldArrayReturn,
  useFormContext,
} from "react-hook-form";
import { cn } from "@/lib/utils";

import SelectScheduleEmployee from "@/components/inputs/SelectScheduleEmployee";
import { color, SHIFT_HOURS_MAP_DAY, SHIFT_HOURS_MAP_NIGHT } from "./constants";
import { handleTableNavigation } from "@/utils/handleTableNavigation";
import { ScheduleType } from "./schema";
import { EmployeesContextValue } from "@/providers/EmployeesProvider";

export default function ScheduleBody({
  fields,
  monthDays,
  selectedEmployees,
  remove,
  move,
}: {
  fields: FieldArrayWithId<ScheduleType, "rowShifts", "id">[];
  monthDays: { day: number; weekday: string }[];
  selectedEmployees: EmployeesContextValue[];
  remove: UseFieldArrayReturn<ScheduleType, "rowShifts", "id">["remove"];
  move: UseFieldArrayReturn<ScheduleType, "rowShifts", "id">["move"];
}) {
  const form = useFormContext();

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

          form.setValue(
            `rowShifts.${rowIndex}.dayHours`,
            totalHoursDay.toString()
          );
          form.setValue(
            `rowShifts.${rowIndex}.nightHours`,
            totalHoursNight.toString()
          );
          form.setValue(
            `rowShifts.${rowIndex}.totalHours`,
            (totalHoursDay + totalHoursNight).toString()
          );
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      // Проверяем, что изменилось поле employee
      if (name?.startsWith("rowShifts.") && name.endsWith(".employee")) {
        const rowIndex = Number(name.split(".")[1]);
        const selectedName = value?.rowShifts?.[rowIndex]?.employee;
        const employee = selectedEmployees.find((e) => e.name === selectedName);

        if (employee) {
          form.setValue(`rowShifts.${rowIndex}.role`, employee.role);
          form.setValue(`rowShifts.${rowIndex}.rate`, employee.rate);
          form.setValue(`rowShifts.${rowIndex}.employeeId`, employee.id);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, selectedEmployees]);

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
  };

  return (
    <TableBody className="[&_input]:h-8 [&_input]:text-md [&_input]:py-0.5 [&_input]:text-center [&_input]:w-8 [&_input]:border-0">
      {fields.map((row, rowIndex) => (
        <TableRow key={row.id} className="hover:text-rd p-0 h-10">
          <TableCell
            className="text-rd cursor-pointer w-2 p-0"
            onClick={() => remove(rowIndex)}
          >
            {rowIndex + 1}
          </TableCell>

          <TableCell className="text-bl p-0 text-xs">
            <input
              {...form.register(`rowShifts.${rowIndex}.dayHours`)}
              readOnly
            />
          </TableCell>
          <TableCell className="text-bl p-0 text-xs">
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
              className="w-32 px-1 hover:text-rd justify-start"
            />
          </TableCell>

          <TableCell
            className="w-3 cursor-pointer p-0"
            onClick={() => resetRow(rowIndex)}
          >
            <Minus className="w-3 h-3" />
          </TableCell>

          {monthDays.map((_day, dayIndex) => {
            const fieldName = `rowShifts.${rowIndex}.shifts.${dayIndex}`;
            const value = form.getValues(fieldName);
            return (
              <TableCell key={dayIndex} className="p-0 text-center w-10">
                <input
                  {...form.register(fieldName)}
                  data-row={rowIndex}
                  data-col={dayIndex}
                  onKeyDown={(e) =>
                    handleTableNavigation(e, rowIndex, dayIndex)
                  }
                  className={cn(
                    "w-10",
                    value === "" ? "bg-border" : "text-bl",
                    color[value as keyof typeof color]
                  )}
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
