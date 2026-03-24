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
          <TableRow key={row.id} className="[&>td]:text-xs">
            <TableCell className="pr-0">{rowIndex + 1}</TableCell>
            <TableCell className="text-bl px-0">{row.dayHours}</TableCell>
            <TableCell className="text-bl px-0">{row.nightHours}</TableCell>
            <TableCell className="font-bold px-0">{row.totalHours}</TableCell>
            <TableCell className="text-gn px-0">
              <span className="print:hidden p-0" data-html2canvas-ignore="true">
                {totalPay}
              </span>
            </TableCell>
            <TableCell
              className={cn(
                "sticky left-0 bg-background pl-2 truncate text-muted-foreground",
                isSelected && "text-rd font-bold text-sm!",
              )}
            >
              {row.employee}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {row.role.charAt(0)}
            </TableCell>

            {row.shifts?.map((day, dayIndex) => {
              const isSelected = dayIndex === todayDay - 1;

              return (
                <TableCell
                  key={dayIndex}
                  className={cn(
                    "text-center border-x text-sm!",
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
