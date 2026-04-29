import { MonthDaysCells } from "@/components/table/month-days-cells";
import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useMonthDays } from "@/providers/month-days-provider";

export default function TtnHeaderTable({
  setItemSearch,
  selectedDay,
  setSelectedDay,
}: {
  setItemSearch: (itemSearch: string) => void;
  selectedDay: number;
  setSelectedDay: (day: number) => void;
}) {
  const { monthDays, month } = useMonthDays();
  return (
    <TableHeader className="bg-background sticky top-0 left-0 z-12">
      <TableRow className="[&>td]:py-0">
        <TableCell className="text-sm">{month?.toUpperCase() || ""}</TableCell>

        <TableCell>
          <input
            type="text"
            placeholder="...search"
            onChange={(e) => setItemSearch(e.target.value)}
            className="w-20 p-1 text-xs outline-none focus:ring-0 focus:outline-none focus-visible:ring-0"
          ></input>
        </TableCell>
        <TableCell className="w-16 p-0" />

        <MonthDaysCells
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          monthDays={monthDays}
          className="w-11"
        />
      </TableRow>
    </TableHeader>
  );
}
