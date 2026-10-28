import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CashVerifySchemaType } from "@/features/report-bar/model/schema";

const classNameHead = "text-shadow-muted-foreground font-bold";
const classNameRowBorder = "border-b-bl";

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
              <TableCell className="text-rd px-0 text-xs" key={i}>
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
