import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export default function AoFooterTable({
  moda,
  nbm,
  nori,
  bar,
}: {
  moda: string;
  nbm: string;
  nori: string;
  bar: string;
}) {
  return (
    <TableFooter>
      <TableRow className="h-12">
        <TableCell colSpan={3}>
          moda-diff:
          <span
            className={cn(
              "pl-2 text-xs font-bold",
              Number(moda) < 0 ? "text-red-600" : "",
            )}
          >
            {moda}
          </span>
        </TableCell>
        <TableCell colSpan={4}>
          nbm-diff:
          <span
            className={cn(
              "pl-2 text-xs font-bold",
              Number(nbm) < 0 ? "text-red-600" : "",
            )}
          >
            {nbm}
          </span>
        </TableCell>
        <TableCell colSpan={4}>
          nori:
          <span
            className={cn(
              "pl-2 text-xs font-bold",
              Number(nori) < 0 ? "text-red-600" : "text-green-600",
            )}
          >
            {nori}
          </span>
        </TableCell>
        <TableCell colSpan={4}>
          bar:
          <span
            className={cn(
              "pl-2 text-xs font-bold",
              Number(bar) < 0 ? "text-red-600" : "text-green-600",
            )}
          >
            {bar}
          </span>
        </TableCell>
        <TableCell colSpan={4}>
          total:
          <span
            className={cn(
              "pl-2 text-xs font-bold",
              Number(bar) < 0 ? "text-red-600" : "text-bl",
            )}
          >
            {+bar + +nori}
          </span>
        </TableCell>
      </TableRow>
    </TableFooter>
  );
}
