import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export default function TableHeaderCash({
  month,
  monthDays,
  className,
}: {
  month: string;
  monthDays: { day: number; weekday: string }[];
  className?: string;
}) {
  if (!month || !monthDays) return null;

  const todayDay = new Date().getDate();
  return (
    <TableHeader>
      <TableRow className="h-12">
        <TableCell colSpan={2} className="w-18 !p-0 front-bold text-center">
          {month?.toUpperCase() || ""}
        </TableCell>

        {monthDays.map((day) => {
          return (
            <TableCell
              key={day.day}
              className={cn(
                "w-9 cursor-pointer !p-0 ",
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
      </TableRow>
    </TableHeader>
  );
}
