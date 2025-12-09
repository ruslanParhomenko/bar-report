import { StandardKitchen } from "@/app/actions/google/googleSheetAction";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations } from "next-intl";

export default function StandardKitchenTable({
  data,
}: {
  data: StandardKitchen[];
}) {
  const t = useTranslations("Home");
  return (
    <Card className="h-[92vh] overflow-auto py-3 md:px-10">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="truncate w-25" />
            <TableHead className="text-center truncate w-10">+2…+3°C</TableHead>
            <TableHead className="text-center truncate w-10">-18°C</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data
            ?.filter((_emp: any, idx: number) => idx !== 0)
            .map((emp: any, idx: number) => (
              <TableRow key={`${emp.date}-${idx}`} className="h-7!">
                <TableCell className="truncate p-0 px-2 w-18">
                  {emp.name}
                </TableCell>
                <TableCell className="text-center truncate p-0 px-2">
                  {emp.timePlus ?? "-"}
                </TableCell>
                <TableCell className="text-center p-0 px-2">
                  {emp.timeMinus ?? "-"}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Card>
  );
}
