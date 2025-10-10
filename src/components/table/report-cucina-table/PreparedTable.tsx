import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Prepared } from "@/generated/prisma";
import { classNameRowBorder } from "../report-bar-table/ReportBarTable";

export default function PreparedTable({ data }: { data: Prepared[] }) {
  return data ? (
    <Table>
      <TableHeader>
        <TableRow className={classNameRowBorder}>
          <TableHead>Prepared</TableHead>
          <TableHead>p</TableHead>
          <TableHead>w</TableHead>
          <TableHead>time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data
          ?.filter((item) => item.product)
          .map((item, index: number) => (
            <TableRow key={index}>
              <TableCell className="truncate">{item.product}</TableCell>
              <TableCell>{item.portions || "-"}</TableCell>
              <TableCell>{item.weight || "-"}</TableCell>
              <TableCell>{item.time}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  ) : null;
}
