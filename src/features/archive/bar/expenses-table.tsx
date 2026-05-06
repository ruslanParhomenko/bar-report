import { ExpensesSchemaType } from "@/features/bar/report/schema";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { classNameHead, classNameRowBorder } from "./report-bar-archive";

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
              <TableCell className="text-rd text-xs">{e.time || ""}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  ) : (
    <div></div>
  );
}
