import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { classNameRowBorder } from "../report-bar-table/ReportBarTable";
import { classNameHeadCucina } from "./ReportCucinaTable";
import { ReportShiftType } from "@/features/report/cucina/schema";

export default function ShiftsTable({ data }: { data: ReportShiftType[] }) {
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
          {data?.map((shift, idx) => (
            <TableRow key={idx}>
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
