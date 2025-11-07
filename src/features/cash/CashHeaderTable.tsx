import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function CashHeaderTable({
  month,
  monthDays,
  className,
}: {
  month: string;
  monthDays: { day: number; weekday: string }[];
  className?: string;
}) {
  const t = useTranslations("Home");
  if (!month || !monthDays) return null;

  const todayDay = new Date().getDate();
  return (
    <TableHeader>
      <TableRow className="h-10">
        <TableCell
          colSpan={2}
          className="w-20 p-0 front-bold text-center text-xs"
        >
          {t(month?.toLocaleLowerCase())}
        </TableCell>

        {monthDays.map((day) => {
          return (
            <TableCell
              key={day.day}
              className={cn(
                "min-w-8 cursor-pointer p-0 ",
                day.day === todayDay && "text-blue-900 front-bold"
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
      </TableRow>
    </TableHeader>
  );
}
