import { StandardKitchen } from "@/app/actions/google/google-action";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export default function StandardKitchenTable({
  data,
}: {
  data: StandardKitchen[] | null;
}) {
  if (!data || data.length <= 1) return null;

  const items = data.slice(1);
  const mid = Math.ceil(items.length / 2);
  const firstHalf = items.slice(0, mid);
  const secondHalf = items.slice(mid);

  const renderTable = (tableData: StandardKitchen[]) => (
    <Table className="table-fixed">
      <TableBody>
        <TableRow className="h-6">
          <TableCell className="w-25 truncate" />
          <TableCell className="w-10 truncate text-center font-bold">
            +2…+3°C
          </TableCell>
          <TableCell className="w-10 truncate text-center font-bold">
            -18°C
          </TableCell>
        </TableRow>
        {tableData.map((emp, idx) => (
          <TableRow
            key={`${emp.name}-${idx}`}
            className="hover:bg-gr h-6.5 hover:text-white"
          >
            <TableCell className="w-18 truncate text-xs">{emp.name}</TableCell>
            <TableCell className="truncate text-center text-xs">
              {emp.timePlus ?? "-"}
            </TableCell>
            <TableCell className="text-center text-xs">
              {emp.timeMinus ?? "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="mt-2 grid grid-cols-1 gap-6 md:grid-cols-2">
      {renderTable(firstHalf)}
      {renderTable(secondHalf)}
    </div>
  );
}
