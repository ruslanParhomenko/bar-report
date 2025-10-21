import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { getMonthDays } from "@/utils/getMonthDays";
import { Trash2 } from "lucide-react";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

export default function ScheduleHeader() {
  const form = useFormContext();

  const month = form.watch("month");
  const year = form.watch("year");

  const monthDays = useMemo(() => {
    if (!month || !year) return [];
    return getMonthDays({ month, year });
  }, [month, year]);
  if (monthDays.length === 0) return null;
  return (
    <TableHeader>
      <TableRow>
        <TableCell className="w-3">
          <Trash2 className="w-4 h-4 text-rd" />
        </TableCell>
        <TableCell className="w-10"></TableCell>
        <TableCell className="w-10"></TableCell>
        <TableCell className="w-32"></TableCell>
        <TableCell className="w-4"></TableCell>
        {monthDays.map((day) => (
          <TableCell key={day.day} className="w-8 text-center cursor-pointer">
            <div className="text-sm font-semibold">{day.day}</div>
            <div className="text-xs text-muted-foreground">{day.weekday}</div>
          </TableCell>
        ))}
        <TableCell className="w-6"></TableCell>
      </TableRow>
    </TableHeader>
  );
}
