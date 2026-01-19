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
import { ReportCucinaData } from "@/app/actions/archive/reportCucinaAction";

export default function ShiftsTable({
  data,
}: {
  data: ReportCucinaData["shifts"];
}) {
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
