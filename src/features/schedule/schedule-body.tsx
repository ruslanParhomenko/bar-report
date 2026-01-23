import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { color, SHIFT_COLOR_MAP } from "./create/constants";
import { calculateSalaryByHours } from "./utils";
import { SchedulesContextValue } from "@/app/actions/schedule/scheduleAction";

export default function ScheduleTableBody({
  schedule,
  isView,
}: {
  schedule: SchedulesContextValue;
  isView: boolean;
}) {
  const todayDay = new Date().getDate();
  return (
    <TableBody>
      {schedule?.rowShifts?.map((row, rowIndex) => {
        const isSelected = !SHIFT_COLOR_MAP.includes(
          row.shifts?.[todayDay - 1],
        );
        const totalPay = isView
          ? calculateSalaryByHours(row).toFixed(0).toString()
          : "0";
        return (
          <TableRow key={row.id} className="hover:text-rd">
            <TableCell>{rowIndex + 1}</TableCell>
            <TableCell className="text-bl text-xs">{row.dayHours}</TableCell>
            <TableCell className="text-bl text-xs">{row.nightHours}</TableCell>
            <TableCell className="font-bold">{row.totalHours}</TableCell>
            <TableCell
              className="text-xs text-gn p-0  print:hidden"
              data-html2canvas-ignore="true"
            >
              {totalPay}
            </TableCell>
            <TableCell
              className={cn(
                "sticky left-0 bg-background pl-2 truncate text-muted-foreground",
                isSelected && "text-rd font-bold",
              )}
            >
              {row.employee}
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
