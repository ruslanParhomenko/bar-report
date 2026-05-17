import { MonthDaysCells } from "@/components/table/month-days-cells";
import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useMonthDays } from "@/providers/month-days-provider";

export default function CashMonthHeaderTable({
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
        <TableCell className="bg-background sticky left-0 w-16 md:bg-transparent"></TableCell>

        <TableCell className="w-24">{month?.toUpperCase()}</TableCell>

        <MonthDaysCells
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          monthDays={monthDays}
          className="min-w-8"
        />
      </TableRow>
    </TableHeader>
  );
}
