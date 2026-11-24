import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useMonthDays } from "@/hooks/use-month-days";
import { MONTHS } from "@/utils/get-month-days";

export function CashYearHeader() {
  const { year } = useMonthDays();
  return (
    <TableHeader className="bg-background sticky top-0 z-10">
      <TableRow className="align-top [&>td]:border-0">
        <TableCell className="text-center align-top">{year}</TableCell>
        <TableCell />

        {MONTHS.map((month) => (
          <TableCell key={month} className="text-center align-top text-xs">
            {month.slice(0, 3).toUpperCase()}
          </TableCell>
        ))}
      </TableRow>
    </TableHeader>
  );
}
