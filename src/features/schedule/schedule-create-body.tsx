"use client";
import MoveButton from "@/components/buttons/move-button";
import NumericInput from "@/components/input-controlled/numeric-input";
import SelectField from "@/components/input-controlled/select-field";
import { MonthDaysCells } from "@/components/table/month-days-cells";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { EmployeesContextValue } from "@/providers/employees-provider";
import { useMonthDays } from "@/providers/month-days-provider";
import { handleMultiTableNavigation } from "@/utils/handle-table-navigation";
import {
  FieldArrayWithId,
  UseFieldArrayReturn,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { color, SHIFT_COLOR_MAP } from "./constants";
import { ScheduleType } from "./schema";
import { calculateSalaryByHours, calculateShiftTotals } from "./utils";

export default function ScheduleCreateTableBody({
  fields,
  selectedEmployees,
  remove,
  move,
  update,
  selectedDay,
}: {
  fields: FieldArrayWithId<ScheduleType, "rowShifts", "id">[];
  selectedEmployees: EmployeesContextValue[];
  remove: UseFieldArrayReturn<ScheduleType, "rowShifts", "id">["remove"];
  move: UseFieldArrayReturn<ScheduleType, "rowShifts", "id">["move"];
  update: UseFieldArrayReturn<ScheduleType, "rowShifts", "id">["update"];
  selectedDay: number;
}) {
  const form = useFormContext();

  const { monthDays } = useMonthDays();
  const isMobile = useIsMobile();

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

        const isSelected = !SHIFT_COLOR_MAP.includes(
          row.shifts?.[Number(selectedDay) - 1],
        );
        return (
          <TableRow
            key={row.id}
            className="hover:text-rd group [&>td]:p-0 [&>td]:text-xs"
          >
            <TableCell
              className="text-rd cursor-pointer px-1"
              onClick={() => remove(rowIndex)}
            >
              {rowIndex + 1}
            </TableCell>

            <TableCell className="text-bl hover-cell px-0">
              {totalDay || 0}
            </TableCell>
            <TableCell className="text-bl hover-cell px-0">
              {totalNight || 0}
            </TableCell>

            <TableCell className="px-0">{total || 0}</TableCell>

            <TableCell className="px-2">
              {totalPay && totalPay.toFixed()}
            </TableCell>
            <TableCell className="text-muted-foreground px-2! text-right">
              {row.role.charAt(0)}
              {rate / 1000}
            </TableCell>
            <TableCell className="sticky left-0 pl-2! bg-background md:bg-transparent">
              <SelectField
                fieldName={`rowShifts.${rowIndex}.employee`}
                data={selectedEmployees.map((e) => e.name)}
                className={cn(
                  "hover-cell truncate p-0 text-xs",
                  isSelected && "text-rd font-bold",
                )}
                onChange={(name) => handleEmployeeChange(name, rowIndex)}
              />
            </TableCell>

            {row.shifts.map((shiftValue, dayIndex) => {
              const isSelected = dayIndex === selectedDay - 1;
              return (
                <TableCell
                  key={dayIndex}
                  className={cn("border-x", isSelected && "text-rd font-bold")}
                >
                  {!isMobile ? (
                    <input
                      {...form.register(
                        `rowShifts.${rowIndex}.shifts.${dayIndex}`,
                      )}
                      data-row={rowIndex}
                      data-col={dayIndex}
                      onKeyDown={handleMultiTableNavigation}
                      className={cn(
                        "hover-cell h-9 w-full text-center text-sm",
                        shiftValue === "" ? "bg-border/20" : "",
                        color[shiftValue as keyof typeof color],
                      )}
                    />
                  ) : (
                    <NumericInput
                      fieldName={`rowShifts.${rowIndex}.shifts.${dayIndex}`}
                      className={cn(
                        "hover-cell h-9 w-full border-0 shadow-none text-center text-xs p-0 rounded-none!",
                        shiftValue === "" ? "bg-border/20" : "",
                        color[shiftValue as keyof typeof color],
                      )}
                    />
                  )}
                </TableCell>
              );
            })}

            <TableCell>
              <MoveButton rowIndex={rowIndex} fields={fields} move={move} />
            </TableCell>
          </TableRow>
        );
      })}
      <TableRow>
        <MonthDaysCells
          monthDays={monthDays}
          selectedDay={selectedDay}
          orientation="bottom"
          colSpan={7}
          clasName="h-10"
        />
      </TableRow>
    </TableBody>
  );
}
