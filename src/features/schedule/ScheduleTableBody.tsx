import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { color } from "./create/constants";
import { SchedulesContextValue } from "@/providers/ScheduleProvider";

export function ScheduleTableBody({
  schedule,
  selectedColumn,
  isView = false,
}: {
  schedule: SchedulesContextValue;
  selectedColumn: number;
  isView?: boolean;
}) {
  const data = schedule.rowShifts || [];
  return (
    <TableBody>
      {data?.map((row, rowIndex) => {
        const isSelected = !["v", "s", ""].includes(
          row.shifts?.[selectedColumn as number]
        );
        const dayHourPay =
          row.role === "mngr"
            ? Number(row.rate) / 186
            : (Number(row.rate) / 186) * 0.9;
        const nightHourPay =
          row.role === "mngr"
            ? Number(row.rate) / 186
            : (Number(row.rate) / 186) * 1.15;
        const totalPay =
          dayHourPay * Number(row.dayHours) +
          nightHourPay * Number(row.nightHours);

        return (
          <TableRow key={row.id} className="hover:text-rd">
            <TableCell>{rowIndex + 1}</TableCell>
            <TableCell className="text-bl text-xs">{row.dayHours}</TableCell>
            <TableCell className="text-bl text-xs">{row.nightHours}</TableCell>
            <TableCell>{row.totalHours}</TableCell>
            <TableCell
              className={cn(
                "sticky left-0 bg-card/40 text-muted-foreground w-34 p-0",
                isSelected && "text-rd font-bold"
              )}
            >
              {row.employee}
            </TableCell>
            <TableCell
              className="w-2 p-0 text-start text-xs  no-print"
              data-html2canvas-ignore="true"
            >
              {isView && totalPay.toFixed(0).toString()}
            </TableCell>

            {row.shifts?.map((day, dayIndex) => {
              const isSelected = dayIndex === selectedColumn;

              return (
                <TableCell
                  key={dayIndex}
                  className={cn(
                    "p-0 text-center border-x",
                    color[day as keyof typeof color],
                    isSelected && "!text-rd font-bold",
                    dayIndex === row.shifts.length - 1 && "border-r-0"
                  )}
                >
                  {["/", "v", "s"].includes(day) ? null : day}
                </TableCell>
              );
            })}
          </TableRow>
        );
      })}
    </TableBody>
  );
}
