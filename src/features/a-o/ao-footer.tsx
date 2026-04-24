import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export default function AoFooterTable({
  moda,
  nbm,
}: {
  moda: string;
  nbm: string;
}) {
  return (
    <TableFooter>
      <TableRow className="h-12">
        <TableCell colSpan={4}>
          moda:
          <span
            className={cn(
              "pl-2 text-xs font-bold",
              Number(moda) < 0 ? "text-red-600" : "text-green-600",
            )}
          >
            {moda}
          </span>
        </TableCell>
        <TableCell colSpan={4}>
          nbm:
          <span
            className={cn(
              "pl-2 text-xs font-bold",
              Number(nbm) < 0 ? "text-red-600" : "text-green-600",
            )}
          >
            {nbm}
          </span>
        </TableCell>
      </TableRow>
    </TableFooter>
  );
}
