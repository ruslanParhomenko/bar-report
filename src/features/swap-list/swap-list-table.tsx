import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { SHIFT_VALUES } from "./constants";

export default function SwapListTable({ swapsList }: { swapsList: any[] }) {
  return (
    <Table>
      <TableBody>
        {swapsList
          .slice(-10) // берем последние 10
          .reverse() // разворачиваем (последние → вверх)
          .map((swap) => (
            <TableRow
              key={`swap-${swap.id}`}
              className="[&>td]:p-1 [&>td]:text-xs"
            >
              <TableCell className="text-blue-500">
                {swap.dateRegister
                  ? format(new Date(swap.dateRegister), "dd.MM HH:mm")
                  : "-"}
              </TableCell>
              <TableCell>
                {swap.employee1.split(" ")[0]}{" "}
                {swap.employee1.split(" ")[1]?.[0] || ""}
              </TableCell>
              <TableCell>
                {SHIFT_VALUES[swap.typeSwap as keyof typeof SHIFT_VALUES] ||
                  "-"}
              </TableCell>
              <TableCell>
                <span className="w-12 truncate">
                  {swap.employee2.split(" ")[0]}{" "}
                  {swap.employee2.split(" ")[1]?.[0] || ""}
                </span>
              </TableCell>
              <TableCell>
                {swap.date ? format(new Date(swap.date), "dd.MM") : "-"}
              </TableCell>
              <TableCell>{swap.shift}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
