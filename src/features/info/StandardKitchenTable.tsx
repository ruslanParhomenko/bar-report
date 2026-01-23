import { StandardKitchen } from "@/app/actions/google/googleSheetAction";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export default function StandardKitchenTable({
  data,
}: {
  data: StandardKitchen[];
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
          <TableCell className="truncate w-25" />
          <TableCell className="text-center truncate w-10  font-bold">
            +2…+3°C
          </TableCell>
          <TableCell className="text-center truncate w-10  font-bold">
            -18°C
          </TableCell>
        </TableRow>
        {tableData.map((emp, idx) => (
          <TableRow
            key={`${emp.name}-${idx}`}
            className="h-6.5 hover:text-white hover:bg-gr"
          >
            <TableCell className="truncate  w-18 text-xs">{emp.name}</TableCell>
            <TableCell className="text-center truncate text-xs">
              {emp.timePlus ?? "-"}
            </TableCell>
            <TableCell className="text-center  text-xs">
              {emp.timeMinus ?? "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
      {renderTable(firstHalf)}
      {renderTable(secondHalf)}
    </div>
  );
}
