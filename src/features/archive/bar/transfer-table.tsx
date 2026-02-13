import { ProductTransferSchemaType } from "@/features/bar/report/schema";
import { classNameHead, classNameRowBorder } from "./report-bar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
              <TableCell className="text-xs text-rd">{e.time || ""}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  ) : (
    <div></div>
  );
}
