import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useMonthDays } from "@/hooks/use-month-days";
import { MONTHS } from "@/utils/get-month-days";

export default function TtnModaHeaderTable() {
  const { year } = useMonthDays();
  return (
    <TableHeader>
      <TableRow className="[&>td]:py-0.5 [&>td]:text-xs">
        <TableCell className="w-32" />
        <TableCell className="w-22 text-start">{year || ""}</TableCell>
        {MONTHS.map((month) => (
          <TableCell key={month} className="text-center">
            {month.slice(0, 3)}
          </TableCell>
        ))}
      </TableRow>
    </TableHeader>
  );
}
