import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Staff } from "@/generated/prisma";
import { classNameRowBorder } from "../report-bar-table/ReportBarTable";

export default function StaffTable({ data }: { data: Staff[] }) {
  return (
    data && (
      <Table>
        <TableHeader>
          <TableRow className={classNameRowBorder}>
            <TableHead>Staff</TableHead>
            <TableHead>p</TableHead>
            <TableHead>w</TableHead>
            <TableHead>time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell className="truncate">{item.product}</TableCell>
              <TableCell>{item.portions || "-"}</TableCell>
              <TableCell>{item.weight || "-"}</TableCell>
              <TableCell>{item?.time || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  );
}
