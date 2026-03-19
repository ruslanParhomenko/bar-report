"use client";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { color, SHIFT_COLOR_MAP } from "./create/constants";
import { calculateSalaryByHours } from "./utils";
import { SchedulesContextValue } from "@/app/actions/schedule/schedule-action";
import { useAbility } from "@/providers/ability-provider";

export default function ScheduleTableBody({
  schedule,
}: {
  schedule: SchedulesContextValue | null;
}) {
  const todayDay = new Date().getDate();

  const { isAdmin } = useAbility();
  return (
    <TableBody>
      {schedule?.rowShifts?.map((row, rowIndex) => {
        const isSelected = !SHIFT_COLOR_MAP.includes(
          row.shifts?.[todayDay - 1],
        );
        const totalPay = isAdmin
          ? calculateSalaryByHours(row).toFixed(0).toString()
          : "0";
        return (
          <TableRow key={row.id} className="hover:text-rd">
            <TableCell className="text-xs font-bold">{rowIndex + 1}</TableCell>
            <TableCell className="text-bl text-xs">{row.dayHours}</TableCell>
            <TableCell className="text-bl text-xs">{row.nightHours}</TableCell>
            <TableCell className="font-bold text-xs">
              {row.totalHours}
            </TableCell>
            <TableCell
              className="text-xs text-gn print:hidden"
              data-html2canvas-ignore="true"
            >
              {totalPay}
            </TableCell>
            <TableCell
              className={cn(
                "sticky left-0 bg-background pl-1 truncate text-muted-foreground",
                isSelected && "text-rd font-bold",
              )}
            >
              {row.employee}
            </TableCell>
            <TableCell className="text-xs text-muted-foreground text-right">
              {row.role.charAt(0)}
            </TableCell>

            {row.shifts?.map((day, dayIndex) => {
              const isSelected = dayIndex === todayDay - 1;

              return (
                <TableCell
                  key={dayIndex}
                  className={cn(
                    "text-center border-x",
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
    </TableBody>
  );
}
