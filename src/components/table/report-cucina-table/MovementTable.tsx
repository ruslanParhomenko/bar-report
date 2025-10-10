import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Movement } from "@/generated/prisma";
import { classNameRowBorder } from "../report-bar-table/ReportBarTable";

export default function MovementTable({ data }: { data: Movement[] }) {
  return (
    data && (
      <Table>
        <TableHeader>
          <TableRow className={classNameRowBorder}>
            <TableHead>Transfer</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((item: any) => (
            <TableRow key={item.id}>
              <TableCell>
                {item.nameOutside} → {item.nameInside} = {item.weight}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  );
}
