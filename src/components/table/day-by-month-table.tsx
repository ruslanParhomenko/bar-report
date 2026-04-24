import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { MonthDayType } from "@/utils/get-month-days";
import { useTranslations } from "next-intl";

export function DayByMonthTable({
  month,
  monthDays,
  className,
  navCell = false,
  infoCell = false,
}: {
  month: string;
  monthDays: MonthDayType[];
  className?: string;
  navCell?: boolean;
  infoCell?: boolean;
}) {
  const t = useTranslations("Home");
  if (!month || !monthDays) return null;

  const todayDay = new Date().getDate();
  return (
    <TableHeader className="bg-background sticky top-0 z-20">
      <TableRow>
        <TableCell colSpan={2} className="front-bold p-0 px-1 text-center">
          {month?.toLocaleUpperCase()}
        </TableCell>
        {infoCell && <TableCell className="w-7 p-0 text-center" />}

        {monthDays.map((day) => {
          return (
            <TableCell
              key={day.day}
              className={cn(
                "w-14 cursor-pointer p-0",
                day.day === todayDay && "text-rd front-bold",
                className,
              )}
            >
              <div className="text-center text-sm font-semibold">{day.day}</div>
              <div
                className={cn(
                  "text-muted-foreground text-center text-xs",
                  day.day === todayDay && "text-rd",
                )}
              >
                {day.weekday}
              </div>
            </TableCell>
          );
        })}
        {navCell && <TableCell className="w-2 p-0" />}
      </TableRow>
    </TableHeader>
  );
}
