import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export default function TableHeaderData({
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
      <TableRow>
        <TableCell className="w-2 text-start p-0" />
        <TableCell className="w-24 p-0 front-bold text-center">
          {month?.toUpperCase() || ""}
        </TableCell>
        <TableCell className="w-7 text-center p-0" />

        {monthDays.map((day) => {
          return (
            <TableCell
              key={day.day}
              className={cn(
                "w-8 cursor-pointer p-0",
                day.day === todayDay && "text-rd front-bold"
              )}
            >
              <div className="text-sm font-semibold text-center">{day.day}</div>
              <div className="text-xs text-muted-foreground text-center">
                {day.weekday}
              </div>
            </TableCell>
          );
        })}

        <TableCell className="w-4" />
      </TableRow>
    </TableHeader>
  );
}
