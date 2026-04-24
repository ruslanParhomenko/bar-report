import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { COLOR_SHIFT, SHIFT_OPTIONS, SHIFTS, TIME_BY_SHIFT } from "./constants";
import type { ShiftCounts } from "./utils";

export default function ScheduleTableFooter({
  shiftCounts,
  role,
}: {
  shiftCounts: ShiftCounts | null;
  role: string;
}) {
  if (!shiftCounts) return null;
  return (
    <TableFooter data-html2canvas-ignore="true">
      {shiftCounts &&
        SHIFT_OPTIONS.filter((item) =>
          SHIFTS[role as keyof typeof SHIFTS]?.includes(item),
        ).map((item, i) => (
          <TableRow key={i} className="border-0">
            <TableCell colSpan={5} />
            <TableCell colSpan={1} />
            <TableCell className="text-muted-foreground px-4 py-1 text-start text-xs">
              <span className="tracking-wider">
                {TIME_BY_SHIFT[item as keyof typeof TIME_BY_SHIFT]}
              </span>
            </TableCell>
            {shiftCounts?.[item]?.map((day, index) => (
              <TableCell
                key={index}
                className={cn(
                  "text-muted-foreground py-0 text-center text-xs",
                  COLOR_SHIFT[day as keyof typeof COLOR_SHIFT],
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
