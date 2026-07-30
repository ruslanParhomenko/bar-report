import { MonthDaysCells } from "@/components/table/month-days-cells";
import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useMonthDays } from "@/providers/month-days-provider";

export default function HeaderTable({
  selectedDay,
  setSelectedDay,
}: {
  selectedDay: number;
  setSelectedDay: (day: number) => void;
}) {
  const { monthDays, month } = useMonthDays();
  return (
    <TableHeader className="bg-background sticky top-0 left-0 z-12">
      <TableRow>
        <TableCell className="w-14" />
        <TableCell className="w-46 text-center text-xs">
          {month?.toUpperCase() || ""}
        </TableCell>
        <TableCell className="w-14 text-center text-xs" />

        <MonthDaysCells
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          monthDays={monthDays}
          className="w-11.2"
        />
      </TableRow>
    </TableHeader>
  );
}
