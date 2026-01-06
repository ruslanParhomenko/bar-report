import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getMonthDays } from "@/utils/getMonthDays";
import { useTranslations } from "next-intl";

export function DayByMonthTable({
  month,
  monthDays,
  className,
  navCell = false,
  infoCell = false,
}: {
  month: string;
  monthDays: ReturnType<typeof getMonthDays>;
  className?: string;
  navCell?: boolean;
  infoCell?: boolean;
}) {
  const t = useTranslations("Home");
  if (!month || !monthDays) return null;

  const todayDay = new Date().getDate();
  return (
    <TableHeader>
      <TableRow className="h-10">
        <TableCell
          colSpan={2}
          className="p-0 px-1 front-bold text-center text-xs"
        >
          {t(month?.toLocaleLowerCase())}
        </TableCell>
        {infoCell && <TableCell className="w-7 text-center p-0" />}

        {monthDays.map((day) => {
          return (
            <TableCell
              key={day.day}
              className={cn(
                "w-12 cursor-pointer p-0 ",
                day.day === todayDay && "text-blue-900 front-bold",
                className
              )}
            >
              <div className="text-sm font-semibold text-center">{day.day}</div>
              <div className="text-xs text-muted-foreground text-center">
                {day.weekday}
              </div>
            </TableCell>
          );
        })}
        <TableCell />
        {navCell && <TableCell className="w-2 p-0" />}
      </TableRow>
    </TableHeader>
  );
}
