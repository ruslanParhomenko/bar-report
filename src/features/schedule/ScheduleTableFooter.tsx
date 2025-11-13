import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { COLOR_SHIFT, SHIFT_OPTIONS, SHIFTS } from "./create/constants";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ShiftCounts } from "./utils";

export function ScheduleTableFooter({
  shiftCounts,
}: {
  shiftCounts: ShiftCounts;
}) {
  const pathname = usePathname().split("/")[2];

  return (
    <TableFooter data-html2canvas-ignore="true" className="no-print">
      {SHIFT_OPTIONS.filter((item) =>
        SHIFTS[pathname as keyof typeof SHIFTS].includes(item)
      ).map((item, i) => (
        <TableRow key={i} className="h-6 bg-card border-0">
          <TableCell
            colSpan={6}
            className="text-end text-muted-gn h-6 pt-0.5 leading-none text-xs"
          >
            {item}
          </TableCell>
          {shiftCounts?.[item]?.map((day, index) => (
            <TableCell
              key={index}
              className={cn(
                "w-8 text-center h-6 pt-0.5 leading-none text-xs text-muted-foreground",
                COLOR_SHIFT[day as keyof typeof COLOR_SHIFT]
              )}
            >
              {day === 0 ? null : day}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableFooter>
  );
}
