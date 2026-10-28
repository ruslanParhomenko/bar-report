import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { InventorySchemaType } from "@/features/report-bar/model/schema";

const classNameHead = "text-shadow-muted-foreground font-bold";
const classNameRowBorder = "border-b-bl";

export default function InventoryTable({
  data,
}: {
  data: InventorySchemaType[] | null;
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
            <TableCell className="text-rd text-xs">{i.time || ""}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <div></div>
  );
}
