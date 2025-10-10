import { Inventory } from "@/generated/prisma";
import { classNameHead, classNameRowBorder } from "./ReportBarTable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";

export default function InventoryTable({ data }: { data: Inventory[] }) {
  return data ? (
    <Table>
      <TableHeader>
        <TableRow className={classNameRowBorder}>
          <TableHead className={classNameHead}>inventory</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((i, idx: number) => (
          <TableRow key={idx}>
            <TableCell>{i.name || "—"}</TableCell>
            <TableCell className="flex datas-center justify-center">
              {i.quantity || "0"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <div></div>
  );
}
