import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Shift } from "@/generated/prisma";
import { classNameRowBorder } from "../report-bar-table/ReportBarTable";
import { classNameHeadCucina } from "./ReportCucinaTable";

export default function ShiftsTable({ data }: { data: Shift[] }) {
  return (
    data && (
      <Table>
        <TableHeader>
          <TableRow className={classNameRowBorder}>
            <TableHead className={classNameHeadCucina}>Employees</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Over</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((shift) => (
            <TableRow key={shift.id}>
              <TableCell>{shift.employees}</TableCell>
              <TableCell>{shift.time}</TableCell>
              <TableCell>{shift.over}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  );
}
