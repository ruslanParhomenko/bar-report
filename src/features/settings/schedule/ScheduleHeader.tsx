import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export default function ScheduleHeader({
  monthDays,
  setSelectedColumn,
  month,
}: {
  monthDays: any[];
  setSelectedColumn?: (index: number) => void;
  month?: string;
}) {
  const todayDay = new Date().getDate();

  return (
    <TableHeader>
      <TableRow>
        <TableCell className="w-2 text-start p-0" />
        <TableCell className="w-6" />
        <TableCell className="w-6" />
        <TableCell className="w-10" />
        <TableCell className="w-32 p-0 front-bold text-center">
          {month?.toUpperCase() || ""}
        </TableCell>
        <TableCell className="w-3 p-0" />

        {monthDays.map((day, index) => {
          return (
            <TableCell
              key={day.day}
              className={cn(
                "w-10 cursor-pointer p-0",
                day.day === todayDay && "text-rd front-bold"
              )}
              onClick={() => setSelectedColumn && setSelectedColumn(index)}
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
