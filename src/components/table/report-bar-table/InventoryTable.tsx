import { classNameHead, classNameRowBorder } from "./ReportBarTable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";

import { ReportBarType } from "@/app/actions/archive/reportBarAction";

export default function InventoryTable({
  data,
}: {
  data: ReportBarType["inventory"];
}) {
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
            <TableCell>{i.quantity || "0"}</TableCell>
            <TableCell className="text-xs text-rd">{i.time || ""}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <div></div>
  );
}
