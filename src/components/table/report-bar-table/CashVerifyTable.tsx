import { CashVerifySchemaType } from "@/features/report/bar/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { classNameHead, classNameRowBorder } from "./ReportBarTable";

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
            .map((c) => (
              <TableCell className="text-xs px-0 text-rd" key={`h-${c.hours}`}>
                {c?.hours || "—"}
              </TableCell>
            ))}
        </TableRow>
        <TableRow>
          {data
            ?.filter((c) => c.value !== "")
            .map((c) => (
              <TableCell key={`v-${c.hours}`}>{c.value || "—"}</TableCell>
            ))}
        </TableRow>
      </TableBody>
    </Table>
  ) : (
    <div></div>
  );
}
