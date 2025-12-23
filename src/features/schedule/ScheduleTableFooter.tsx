import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { COLOR_SHIFT, SHIFT_OPTIONS, SHIFTS } from "./create/constants";
import { cn } from "@/lib/utils";
import { getShiftCounts } from "./utils";
import { SchedulesContextValue } from "@/app/actions/schedule/scheduleAction";

export default function ScheduleTableFooter({
  schedule,
}: {
  schedule: SchedulesContextValue | null;
}) {
  const shiftCounts = schedule && getShiftCounts(schedule);
  return (
    <TableFooter data-html2canvas-ignore="true">
      {shiftCounts &&
        SHIFT_OPTIONS.filter((item) =>
          SHIFTS[schedule?.role as keyof typeof SHIFTS].includes(item)
        ).map((item, i) => (
          <TableRow key={i} className="border-0">
            <TableCell colSpan={4} />
            <TableCell colSpan={1} className="print:hidden" />
            <TableCell className="text-muted-gn py-0 px-3 text-end text-xs">
              {item}
            </TableCell>
            {shiftCounts?.[item]?.map((day, index) => (
              <TableCell
                key={index}
                className={cn(
                  "text-center py-0 text-xs text-muted-foreground",
                  COLOR_SHIFT[day as keyof typeof COLOR_SHIFT]
                )}
              >
                {day === 0 ? "" : day}
              </TableCell>
            ))}
          </TableRow>
        ))}
    </TableFooter>
  );
}
