import { CashVerifySchemaType } from "@/features/bar/report/schema";

import { classNameHead, classNameRowBorder } from "./report-bar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CashVerifyTable({
  data,
}: {
  data: CashVerifySchemaType[] | null;
}) {
  return data ? (
    <Table>
      <TableHeader>
        <TableRow className={classNameRowBorder}>
          <TableHead colSpan={data?.length || 1} className={classNameHead}>
            cash verify
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow>
          {data
            ?.filter((c) => c.value !== "")
            .map((c, i) => (
              <TableCell className="text-xs px-0 text-rd" key={i}>
                {c?.hours || "—"}
              </TableCell>
            ))}
        </TableRow>
        <TableRow>
          {data
            ?.filter((c) => c.value !== "")
            .map((c, i) => (
              <TableCell key={i}>{c.value || "—"}</TableCell>
            ))}
        </TableRow>
      </TableBody>
    </Table>
  ) : (
    <div></div>
  );
}
