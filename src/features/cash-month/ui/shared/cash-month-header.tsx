import { MonthDaysCells } from "@/components/table/month-days-cells";
import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useMonthDays } from "@/hooks/use-month-days";

type Props = {
  selectedDay?: number;
  setSelectedDay?: (day: number) => void;
};

export default function CashMonthHeader({
  selectedDay,
  setSelectedDay,
}: Props) {
  const { monthDays, month } = useMonthDays();

  return (
    <TableHeader>
      <TableRow>
        <TableCell className="bg-background sticky left-0 w-16 md:bg-transparent"></TableCell>

        <TableCell className="w-36">{month?.toUpperCase()}</TableCell>

        <MonthDaysCells
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          monthDays={monthDays}
          className="w-auto min-w-6"
        />
      </TableRow>
    </TableHeader>
  );
}
