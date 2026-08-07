import { MonthDaysCells } from "@/components/table/month-days-cells";
import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useMonthDays } from "@/providers/month-days-provider";

export default function TtnNbmHeaderTable({
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
        <TableCell className="w-15" />
        <TableCell className="w-24 text-center text-xs">
          {month?.toUpperCase() || ""}
        </TableCell>

        <MonthDaysCells
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          monthDays={monthDays}
          className="w-12.5 text-center text-xs"
        />
      </TableRow>
    </TableHeader>
  );
}
