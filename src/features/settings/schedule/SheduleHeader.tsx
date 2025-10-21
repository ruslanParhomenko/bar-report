import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { getMonthDays } from "@/utils/getMonthDays";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

export default function SheduleHeader() {
  const form = useFormContext();

  const month = form.watch("month");
  const year = form.watch("year");

  const monthDays = useMemo(() => {
    if (!month || !year) return [];
    return getMonthDays({ month, year });
  }, [month, year]);
  return (
    <TableHeader>
      <TableRow>
        <TableCell className="w-6"></TableCell>
        <TableCell className="w-6"></TableCell>
        <TableCell className="w-6"></TableCell>
        <TableCell className="w-8"></TableCell>
        <TableCell className="w-40"></TableCell>

        {monthDays.map((day) => (
          <TableCell key={day.day} className={"w-7 text-center cursor-pointer"}>
            <div className="text-sm font-semibold">{day.day}</div>
            <div className="text-xs text-muted-foreground">{day.weekday}</div>
          </TableCell>
        ))}
      </TableRow>
    </TableHeader>
  );
}
