import { Expense } from "@/generated/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { classNameHead, classNameRowBorder } from "./ReportBarTable";

export default function ExpensesTable({ data }: { data: Expense[] }) {
  return data ? (
    <Table>
      <TableHeader>
        <TableRow className={classNameRowBorder}>
          <TableHead className={classNameHead ?? ""}>expenses</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data
          ?.filter((e: Expense) => e.name !== "")
          .map((e: any, idx: number) => (
            <TableRow key={idx}>
              <TableCell>{e.name || "—"} :</TableCell>
              <TableCell>{e.sum || "0"}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  ) : (
    <div></div>
  );
}
