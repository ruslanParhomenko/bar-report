import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { on } from "events";
import { Trash2 } from "lucide-react";

export default function ScheduleHeader({ monthDays }: { monthDays: any[] }) {
  if (monthDays.length === 0) return null;
  return (
    <TableHeader>
      <TableRow>
        <TableCell className="w-3">
          <Trash2 className="w-4 h-4 text-rd" />
        </TableCell>
        <TableCell className="w-10"></TableCell>
        <TableCell className="w-10"></TableCell>
        <TableCell className="w-33"></TableCell>
        <TableCell className="w-2"></TableCell>
        {monthDays.map((day) => (
          <TableCell key={day.day} className="w-9 cursor-pointer p-0">
            <div className="text-sm font-semibold text-center">{day.day}</div>
            <div className="text-xs text-muted-foreground text-center">
              {day.weekday}
            </div>
          </TableCell>
        ))}
        <TableCell className="w-6"></TableCell>
      </TableRow>
    </TableHeader>
  );
}
