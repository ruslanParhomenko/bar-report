"use client";
import { SchedulesContextValue } from "@/app/actions/schedule/schedule-action";
import { MonthDaysCells } from "@/components/table/month-days-cells";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useAbility } from "@/providers/ability-provider";
import { useMonthDays } from "@/providers/month-days-provider";
import { color, SHIFT_COLOR_MAP } from "./constants";
import { calculateSalaryByHours } from "./utils";

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
                className="px-0 print:hidden"
                data-html2canvas-ignore="true"
              >
                {totalPay}
              </span>
            </TableCell>
            <TableCell className="text-muted-foreground text-right">
              {row.role.charAt(0)}
            </TableCell>
            <TableCell
              className={cn(
                "bg-background text-muted-foreground sticky left-0 h-9 truncate pr-1 pl-2",
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
          clasName="h-10"
        />
      </TableRow>
    </TableBody>
  );
}
