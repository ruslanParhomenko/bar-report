"use client";
import { useEffect } from "react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  FieldArrayWithId,
  UseFieldArrayReturn,
  useFormContext,
} from "react-hook-form";
import { cn } from "@/lib/utils";
import SelectScheduleEmployee from "@/components/inputs/SelectScheduleEmployee";
import { handleTableNavigation } from "@/utils/handleTableNavigation";
import { EmployeesContextValue } from "@/providers/EmployeesProvider";
import { MonthDayType } from "@/utils/getMonthDays";
import { ScheduleType } from "./schema";
import { color, SHIFT_HOURS_MAP_DAY, SHIFT_HOURS_MAP_NIGHT } from "./constants";
import { calculateSalaryByHours } from "../utils";

export default function ScheduleCreateTableBody({
  fields,
  monthDays,
  selectedEmployees,
  remove,
  move,
}: {
  fields: FieldArrayWithId<ScheduleType, "rowShifts", "id">[];
  monthDays: MonthDayType[];
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
  return (
    <TableBody>
      {fields.map((row, rowIndex) => {
        const rate = form.getValues(`rowShifts.${rowIndex}.rate`);
        const totalPay = calculateSalaryByHours(row);
        return (
          <TableRow key={row.id} className="hover:text-rd">
            <TableCell
              className="text-rd cursor-pointer text-xs"
              onClick={() => remove(rowIndex)}
            >
              {rowIndex + 1}
            </TableCell>

            <TableCell className="text-bl text-xs">
              <input
                {...form.register(`rowShifts.${rowIndex}.dayHours`)}
                className="w-6"
                readOnly
              />
            </TableCell>
            <TableCell className="text-bl text-xs">
              <input
                {...form.register(`rowShifts.${rowIndex}.nightHours`)}
                className="w-6"
                readOnly
              />
            </TableCell>

            <TableCell className="text-center">
              <input
                {...form.register(`rowShifts.${rowIndex}.totalHours`)}
                className="font-bold w-6"
                readOnly
              />
            </TableCell>

            <TableCell className="text-xs p-0">
              {rate / 1000}:{totalPay && ` ${totalPay.toFixed()}`}
            </TableCell>
            <TableCell className="p-0">
              <SelectScheduleEmployee
                fieldName={`rowShifts.${rowIndex}.employee`}
                data={selectedEmployees}
                className="hover:text-rd justify-start w-32"
              />
            </TableCell>

            {monthDays.map((_day, dayIndex) => {
              const fieldName = `rowShifts.${rowIndex}.shifts.${dayIndex}`;
              const value = form.getValues(fieldName);
              return (
                <TableCell key={dayIndex} className="border-x p-0">
                  <input
                    {...form.register(fieldName)}
                    data-row={rowIndex}
                    data-col={dayIndex}
                    onKeyDown={(e) =>
                      handleTableNavigation(e, rowIndex, dayIndex)
                    }
                    className={cn(
                      "w-11 h-9 text-center",
                      value === "" ? "bg-border/20" : "",
                      color[value as keyof typeof color]
                    )}
                  />
                </TableCell>
              );
            })}

            <TableCell className="py-0 flex flex-col justify-center items-center">
              <button
                type="button"
                disabled={rowIndex === 0}
                onClick={() => move(rowIndex, rowIndex - 1)}
                className="cursor-pointer"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={rowIndex === fields.length - 1}
                onClick={() => move(rowIndex, rowIndex + 1)}
                className="cursor-pointer"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
}
