"use client";
import { useEffect } from "react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  FieldArrayWithId,
  UseFieldArrayReturn,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { cn } from "@/lib/utils";
import { EmployeesContextValue } from "@/providers/employees-provider";
import { ScheduleType } from "./schema";
import { color, SHIFT_HOURS_MAP_DAY, SHIFT_HOURS_MAP_NIGHT } from "./constants";
import { calculateSalaryByHours } from "../utils";
import SelectField from "@/components/inputs/select-input";
import { handleMultiTableNavigation } from "@/utils/handle-table-navigation";

export default function ScheduleCreateTableBody({
  fields,
  selectedEmployees,
  remove,
  move,
}: {
  fields: FieldArrayWithId<ScheduleType, "rowShifts", "id">[];
  selectedEmployees: EmployeesContextValue[];
  remove: UseFieldArrayReturn<ScheduleType, "rowShifts", "id">["remove"];
  move: UseFieldArrayReturn<ScheduleType, "rowShifts", "id">["move"];
}) {
  const form = useFormContext();

  const shifts = useWatch({
    control: form.control,
    name: "rowShifts",
  });

  // useEffect(() => {
  //   const subscription = form.watch((_, { name }) => {
  //     if (name?.includes("shifts")) {
  //       const match = name.match(/rowShifts\.(\d+)\.shifts/);
  //       if (match) {
  //         const rowIndex = parseInt(match[1]);
  //         const shifts = form.getValues(`rowShifts.${rowIndex}.shifts`) || [];

  //         const totalHoursDay = shifts.reduce(
  //           (sum: number, val: string) =>
  //             sum + (SHIFT_HOURS_MAP_DAY?.[val] ?? 0),
  //           0,
  //         );
  //         const totalHoursNight = shifts.reduce(
  //           (sum: number, val: string) =>
  //             sum + (SHIFT_HOURS_MAP_NIGHT?.[val] ?? 0),
  //           0,
  //         );

  //         form.setValue(
  //           `rowShifts.${rowIndex}.dayHours`,
  //           totalHoursDay.toString(),
  //         );
  //         form.setValue(
  //           `rowShifts.${rowIndex}.nightHours`,
  //           totalHoursNight.toString(),
  //         );
  //         form.setValue(
  //           `rowShifts.${rowIndex}.totalHours`,
  //           (totalHoursDay + totalHoursNight).toString(),
  //         );
  //       }
  //     }
  //   });

  //   return () => subscription.unsubscribe();
  // }, [form]);
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
        const rowShifts = shifts[rowIndex] || [];

        const dayHours = (rowShifts.shifts || []).reduce(
          (sum: number, val: string) => sum + (SHIFT_HOURS_MAP_DAY?.[val] ?? 0),
          0,
        );
        const nightHours = (rowShifts.shifts || []).reduce(
          (sum: number, val: string) =>
            sum + (SHIFT_HOURS_MAP_NIGHT?.[val] ?? 0),
          0,
        );
        const rate = form.getValues(`rowShifts.${rowIndex}.rate`);
        const totalPay = calculateSalaryByHours({
          ...rowShifts,
          dayHours,
          nightHours,
        });

        console.log(totalPay);
        return (
          <TableRow key={row.id} className="hover:text-rd">
            <TableCell
              className="text-rd cursor-pointer text-xs"
              onClick={() => remove(rowIndex)}
            >
              {rowIndex + 1}
            </TableCell>

            <TableCell className="text-bl text-xs">
              {/* <input
                {...form.register(`rowShifts.${rowIndex}.dayHours`)}
                readOnly
              /> */}
              {dayHours || 0}
            </TableCell>
            <TableCell className="text-bl text-xs">
              {/* <input
                {...form.register(`rowShifts.${rowIndex}.nightHours`)}
                readOnly
              /> */}
              {nightHours || 0}
            </TableCell>

            <TableCell className="text-center text-xs font-bold">
              {/* <input
                {...form.register(`rowShifts.${rowIndex}.totalHours`)}
                className="font-bold text-xs"
                readOnly
              /> */}
              {dayHours + nightHours}
            </TableCell>

            <TableCell className="text-xs text-center">
              {totalPay && ` ${totalPay.toFixed()}`}
            </TableCell>
            <TableCell className="py-0 sticky left-0">
              <SelectField
                fieldName={`rowShifts.${rowIndex}.employee`}
                data={selectedEmployees.map((e) => e.name)}
                className="hover:text-rd justify-start p-0"
              />
            </TableCell>
            <TableCell className="p-0 text-xs">
              {row.role.charAt(0)}-{rate / 1000}
            </TableCell>

            {row.shifts.map((_day, dayIndex) => {
              const fieldName = `rowShifts.${rowIndex}.shifts.${dayIndex}`;
              const value = form.getValues(fieldName);
              return (
                <TableCell key={dayIndex} className="border-x p-0">
                  <input
                    {...form.register(fieldName)}
                    data-row={rowIndex}
                    data-col={dayIndex}
                    onKeyDown={handleMultiTableNavigation}
                    className={cn(
                      "w-full h-9 text-center",
                      value === "" ? "bg-border/20" : "",
                      color[value as keyof typeof color],
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
                <ChevronUp className="w-5 h-4" />
              </button>
              <button
                type="button"
                disabled={rowIndex === fields.length - 1}
                onClick={() => move(rowIndex, rowIndex + 1)}
                className="cursor-pointer"
              >
                <ChevronDown className="w-5 h-4" />
              </button>
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
}
