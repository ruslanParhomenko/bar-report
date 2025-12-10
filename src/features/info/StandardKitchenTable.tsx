import { StandardKitchen } from "@/app/actions/google/googleSheetAction";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export default function StandardKitchenTable({
  data,
}: {
  data: StandardKitchen[];
}) {
  return (
    <Card className="h-[90vh] overflow-auto md:w-[50%] md:px-8">
      <Table className="table-fixed">
        <TableBody>
          <TableRow className="h-6">
            <TableCell className="truncate w-25" />
            <TableCell className="text-center truncate w-10 p-0 font-bold">
              +2…+3°C
            </TableCell>
            <TableCell className="text-center truncate w-10 p-0 font-bold">
              -18°C
            </TableCell>
          </TableRow>
          {data
            ?.filter((_emp: any, idx: number) => idx !== 0)
            .map((emp: any, idx: number) => (
              <TableRow
                key={`${emp.date}-${idx}`}
                className="h-6.5 hover:text-white hover:bg-gr"
              >
                <TableCell className="truncate p-0 px-2 w-18 text-xs">
                  {emp.name}
                </TableCell>
                <TableCell className="text-center truncate p-0 px-2 text-xs">
                  {emp.timePlus ?? "-"}
                </TableCell>
                <TableCell className="text-center p-0 px-2 text-xs">
                  {emp.timeMinus ?? "-"}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Card>
  );
}
