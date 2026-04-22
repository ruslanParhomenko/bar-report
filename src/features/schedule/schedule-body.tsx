"use client";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { color, SHIFT_COLOR_MAP } from "./constants";
import { calculateSalaryByHours } from "./utils";
import { SchedulesContextValue } from "@/app/actions/schedule/schedule-action";
import { useAbility } from "@/providers/ability-provider";
import { useMonthDays } from "@/providers/month-days-provider";
import { MonthDaysCells } from "@/components/table/month-days-cells";

export default function ScheduleTableBody({
  schedule,
  selectedDay,
}: {
  schedule: SchedulesContextValue | null;
  selectedDay: number;
}) {
  const { monthDays } = useMonthDays();

  const { isAdmin } = useAbility();
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
          <TableRow key={row.id} className="[&>td]:text-xs">
            <TableCell className="px-1">{rowIndex + 1}</TableCell>
            <TableCell className="text-bl px-0">{row.dayHours}</TableCell>
            <TableCell className="text-bl px-0">{row.nightHours}</TableCell>
            <TableCell className="px-0">{row.totalHours}</TableCell>
            <TableCell className="text-gn px-0">
              <span
                className="print:hidden px-0"
                data-html2canvas-ignore="true"
              >
                {totalPay}
              </span>
            </TableCell>
            <TableCell className="text-muted-foreground  text-right">
              {row.role.charAt(0)}
            </TableCell>
            <TableCell
              className={cn(
                "sticky left-0 bg-background pl-2 pr-1 truncate text-muted-foreground h-9",
                isSelected && "text-rd font-bold",
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
                    "text-center border-x text-xs p-0",
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
      <MonthDaysCells
        monthDays={monthDays}
        selectedDay={selectedDay}
        orientation="bottom"
        colSpan={7}
        clasName="h-10"
      />
    </TableBody>
  );
}
