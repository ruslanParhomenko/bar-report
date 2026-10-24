import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ArrowRight, Moon, Sun, Sunset } from "lucide-react";
import {
  COLOR_SHIFT,
  SHIFT_OPTIONS,
  SHIFTS,
  TIME_BY_SHIFT,
} from "../../schedule-edit/model/constants";
import { ShiftCounts } from "../../schedule-edit/model/type";

const SHIFT_ICONS = {
  day: {
    icon: Sun,
    className: "text-yl fill-current",
  },
  evening: {
    icon: Sunset,
    className: "text-rd fill-current",
  },
  night: {
    icon: Moon,
    className: "text-bl fill-current",
  },
} as const;

function getShiftIcon(shift: string) {
  const startHour = Number.parseInt(shift, 10);

  if (startHour >= 18 || startHour < 6) return SHIFT_ICONS.night;
  if (startHour >= 12) return SHIFT_ICONS.evening;

  return SHIFT_ICONS.day;
}

export default function ScheduleTableFooter({
  shiftCounts,
  role,
}: {
  shiftCounts: ShiftCounts | null;
  role: string;
}) {
  if (!shiftCounts) return null;

  return (
    <TableFooter data-html2canvas-ignore="true" className="border-0">
      {shiftCounts &&
        SHIFT_OPTIONS.filter((item) =>
          SHIFTS[role as keyof typeof SHIFTS]?.includes(item),
        ).map((item, i) => {
          const Icon = getShiftIcon(item).icon;
          const className = getShiftIcon(item).className;
          return (
            <TableRow key={i} className="border-0">
              <TableCell colSpan={7} className="py-0.5 pr-10 text-end text-xs">
                <span className="text-muted-foreground inline-flex items-center justify-center gap-3">
                  <Icon
                    className={cn("size-3 shrink-0", className)}
                    aria-hidden="true"
                  />

                  <span className="min-w-10 text-center font-medium">
                    {TIME_BY_SHIFT[item as keyof typeof TIME_BY_SHIFT]
                      .split("–")[0]
                      .trim()}
                  </span>

                  <ArrowRight
                    className="size-3 shrink-0 opacity-60"
                    aria-hidden="true"
                  />

                  <span className="min-w-10 text-center font-medium">
                    {TIME_BY_SHIFT[item as keyof typeof TIME_BY_SHIFT]
                      .split("–")[1]
                      .trim()}
                  </span>
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
          );
        })}
    </TableFooter>
  );
}
