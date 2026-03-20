"use client";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  FieldArrayWithId,
  UseFieldArrayReturn,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { cn } from "@/lib/utils";
import { EmployeesContextValue } from "@/providers/employees-provider";
import { ScheduleType } from "./schema";
import { color } from "./constants";
import { calculateSalaryByHours } from "../utils";
import SelectField from "@/components/inputs/select-input";
import { handleMultiTableNavigation } from "@/utils/handle-table-navigation";
import MoveButton from "@/components/buttons/move-button";
import { calculateShiftTotals } from "./utils";

export default function ScheduleCreateTableBody({
  fields,
  selectedEmployees,
  remove,
  move,
  update,
}: {
  fields: FieldArrayWithId<ScheduleType, "rowShifts", "id">[];
  selectedEmployees: EmployeesContextValue[];
  remove: UseFieldArrayReturn<ScheduleType, "rowShifts", "id">["remove"];
  move: UseFieldArrayReturn<ScheduleType, "rowShifts", "id">["move"];
  update: UseFieldArrayReturn<ScheduleType, "rowShifts", "id">["update"];
}) {
  const form = useFormContext();

  const shifts = useWatch({
    control: form.control,
    name: "rowShifts",
  });

  function handleEmployeeChange(selectedName: string, rowIndex: number) {
    const employee = selectedEmployees.find(
      (e) => e.name.trim() === selectedName.trim(),
    );
    if (!employee) return;

    update(rowIndex, {
      ...form.getValues(`rowShifts.${rowIndex}`),
      employee: employee.name,
      role: employee.role,
      rate: employee.rate,
      employeeId: employee.id,
    });
  }
  return (
    <TableBody>
      {fields.map((row, rowIndex) => {
        const rowShifts = shifts[rowIndex] || [];
        const { totalDay, totalNight, total } = calculateShiftTotals(
          rowShifts.shifts,
        );

        const rate = form.getValues(`rowShifts.${rowIndex}.rate`);
        const totalPay = calculateSalaryByHours({
          ...rowShifts,
          dayHours: totalDay,
          nightHours: totalNight,
        });
        return (
          <TableRow
            key={row.id}
            className="hover:text-rd group [&>td]:p-0 [&>td]:text-xs"
          >
            <TableCell
              className="text-rd cursor-pointer"
              onClick={() => remove(rowIndex)}
            >
              {rowIndex + 1}
            </TableCell>

            <TableCell className="text-bl hover-cell">
              {totalDay || 0}
            </TableCell>
            <TableCell className="text-bl hover-cell">
              {totalNight || 0}
            </TableCell>

            <TableCell className="font-bold">{total || 0}</TableCell>

            <TableCell>{totalPay && ` ${totalPay.toFixed()}`}</TableCell>
            <TableCell className="sticky left-0 pl-2!">
              <SelectField
                fieldName={`rowShifts.${rowIndex}.employee`}
                data={selectedEmployees.map((e) => e.name)}
                className="hover-cell p-0 text-xs "
                onChange={(name) => handleEmployeeChange(name, rowIndex)}
              />
            </TableCell>
            <TableCell>
              {row.role.charAt(0)}-{rate / 1000}
            </TableCell>

            {row.shifts.map((shiftValue, dayIndex) => {
              return (
                <TableCell key={dayIndex} className="border-x">
                  <input
                    {...form.register(
                      `rowShifts.${rowIndex}.shifts.${dayIndex}`,
                    )}
                    data-row={rowIndex}
                    data-col={dayIndex}
                    onKeyDown={handleMultiTableNavigation}
                    className={cn(
                      "w-full h-9 text-center text-sm hover-cell",
                      shiftValue === "" ? "bg-border/20" : "",
                      color[shiftValue as keyof typeof color],
                    )}
                  />
                </TableCell>
              );
            })}

            <TableCell>
              <MoveButton rowIndex={rowIndex} fields={fields} move={move} />
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
}
