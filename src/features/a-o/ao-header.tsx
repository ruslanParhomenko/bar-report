import { MonthDaysCells } from "@/components/table/month-days-cells";
import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useMonthDays } from "@/providers/month-days-provider";

export default function AoHeaderTable({
  selectedDay,
  setSelectedDay,
}: {
  selectedDay: number;
  setSelectedDay: (day: number) => void;
}) {
  const { monthDays, month } = useMonthDays();

  return (
    <TableHeader>
      <TableRow>
        <TableCell className="w-22"></TableCell>

        <TableCell className="w-26">{month?.toUpperCase()}</TableCell>

        <MonthDaysCells
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          monthDays={monthDays}
          className="w-12"
        />
      </TableRow>
    </TableHeader>
  );
}
