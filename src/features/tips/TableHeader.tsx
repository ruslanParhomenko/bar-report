import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export default function TableHeaderData({
  month,
  monthDays,
}: {
  month: string;
  monthDays: { day: number; weekday: string }[];
}) {
  if (!month || !monthDays) return null;

  const todayDay = new Date().getDate();
  return (
    <TableHeader>
      <TableRow>
        <TableCell className="w-3 text-start p-0" />
        <TableCell className="w-30 p-0 front-bold text-center">
          {month?.toUpperCase() || ""}
        </TableCell>

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

        <TableCell className="w-6" />
      </TableRow>
    </TableHeader>
  );
}
