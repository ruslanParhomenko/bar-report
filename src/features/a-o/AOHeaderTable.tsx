import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function AOHeaderTable({
  month,
  monthDays,
}: {
  month: string;
  monthDays: { day: number; weekday: string }[];
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

        {monthDays.map((day) => {
          return (
            <TableCell
              key={day.day}
              className={cn(
                "w-12 cursor-pointer p-0 ",
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
