"use client";
import { MonthDaysCells } from "@/components/table/month-days-cells";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { useMonthDays } from "@/hooks/use-month-days";
import { calculateSalaryByHours } from "../../schedule-edit/lib/utils";
import { color, SHIFT_COLOR_MAP } from "../../schedule-edit/model/constants";
import { GetScheduleData } from "../../schedule-edit/model/type";

export default function ScheduleTableBody({
  schedule,
  selectedDay,
  isAdmin,
}: {
  schedule: GetScheduleData | null;
  selectedDay: number;
  isAdmin: boolean;
}) {
  const { monthDays } = useMonthDays();

  const employeesLength = schedule?.rowShifts.length || 0;

  return (
    <TableBody>
      {schedule?.rowShifts?.map((row, rowIndex) => {
        const isSelected = !SHIFT_COLOR_MAP.includes(
          row.shifts?.[Number(selectedDay) - 1],
        );
        const totalPay = isAdmin
          ? calculateSalaryByHours(row).toFixed(0).toString()
          : "0";
        return (
          <TableRow
            key={row.id}
            className="print:[&>td]:text-md! print:h-12 [&>td]:text-xs"
          >
            <TableCell className="px-1 print:px-0">{rowIndex + 1}</TableCell>
            <TableCell className="text-bl px-0">{row.dayHours}</TableCell>
            <TableCell className="text-bl px-0">{row.nightHours}</TableCell>
            <TableCell className="px-0">{row.totalHours}</TableCell>
            <TableCell className="text-gn px-0">
              <span
                className="px-0 print:hidden"
                data-html2canvas-ignore="true"
              >
                {totalPay}
              </span>
            </TableCell>
            <TableCell className="text-muted-foreground text-right print:w-6 print:px-0">
              {row.role.charAt(0)}
            </TableCell>
            <TableCell
              className={cn(
                "bg-background text-muted-foreground sticky left-0 truncate pr-1 pl-2 md:bg-transparent",
                isSelected && "text-rd font-bold",
                employeesLength < 18 && "h-9",
              )}
            >
              {row.employee}
            </TableCell>

            {row.shifts.map((day, dayIndex) => {
              const isSelected = dayIndex === selectedDay - 1;

              return (
                <TableCell
                  key={dayIndex}
                  className={cn(
                    "border-x p-0 text-center text-xs",
                    color[day as keyof typeof color],
                    isSelected && "text-rd font-bold",
                  )}
                >
                  {SHIFT_COLOR_MAP.includes(day) ? null : day}
                </TableCell>
              );
            })}
          </TableRow>
        );
      })}
      <TableRow>
        <MonthDaysCells
          monthDays={monthDays}
          selectedDay={selectedDay}
          orientation="bottom"
          colSpan={7}
          className="h-10"
        />
      </TableRow>
    </TableBody>
  );
}
