import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useMonthDays } from "@/hooks/use-month-days";
import { MONTHS } from "@/utils/get-month-days";

export default function TtnModaHeaderTable() {
  const { year } = useMonthDays();
  return (
    <TableHeader>
      <TableRow className="[&>td]:py-0.5 [&>td]:text-xs">
        <TableCell className="w-34" />
        <TableCell className="w-22 text-start">{year || ""}</TableCell>
        <TableCell className="w-18" />
        {MONTHS.map((month) => (
          <TableCell key={month} className="w-30 text-center">
            {month.slice(0, 3)}
          </TableCell>
        ))}
      </TableRow>
    </TableHeader>
  );
}
