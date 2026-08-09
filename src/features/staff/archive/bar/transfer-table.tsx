import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { classNameHead, classNameRowBorder } from "./report-bar-archive";
import { ProductTransferSchemaType } from "../../bar/report/model/schema";

export default function ProductTransferTable({
  data,
}: {
  data: ProductTransferSchemaType[] | null;
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
              <TableCell>{e.name || "—"} -</TableCell>
              <TableCell>{e.destination || "-"}</TableCell>
              <TableCell>{e.quantity || "0"}</TableCell>
              <TableCell className="text-rd text-xs">{e.time || ""}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  ) : (
    <div></div>
  );
}
