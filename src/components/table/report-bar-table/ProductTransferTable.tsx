import { ProductTransfer } from "@/generated/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { classNameHead, classNameRowBorder } from "./ReportBarTable";

export default function ProductTransferTable({
  data,
}: {
  data: ProductTransfer[];
}) {
  return data ? (
    <Table>
      <TableHeader>
        <TableRow className={classNameRowBorder}>
          <TableHead className={classNameHead}>transfer</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data
          ?.filter((e) => e.name !== "")
          .map((e, idx: number) => (
            <TableRow key={idx}>
              <TableCell>{e.name || "—"} :</TableCell>
              <TableCell>{e.quantity || "0"}</TableCell>
              <TableCell>{e.destination || "-"}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  ) : (
    <div></div>
  );
}
