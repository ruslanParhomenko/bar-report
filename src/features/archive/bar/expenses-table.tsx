import { ExpensesSchemaType } from "@/features/bar/report/schema";

import { classNameHead, classNameRowBorder } from "./report-bar";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";

export default function ExpensesTable({
  data,
}: {
  data: ExpensesSchemaType[] | null;
}) {
  return data ? (
    <Table>
      <TableHeader>
        <TableRow className={classNameRowBorder}>
          <TableHead className={classNameHead ?? ""}>expenses</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data
          ?.filter((e) => e.name !== "")
          .map((e, idx) => (
            <TableRow key={idx}>
              <TableCell>{e.name || "—"} -</TableCell>
              <TableCell>{e.sum || "0"}</TableCell>
              <TableCell className="text-xs text-rd">{e.time || ""}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  ) : (
    <div></div>
  );
}
