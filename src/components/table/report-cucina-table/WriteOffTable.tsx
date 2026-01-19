import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { classNameRowBorder } from "../report-bar-table/ReportBarTable";
import { ReportCucinaData } from "@/app/actions/archive/reportCucinaAction";

export default function WriteOffTable({
  data,
}: {
  data: ReportCucinaData["writeOff"];
}) {
  return (
    data && (
      <Table>
        <TableHeader>
          <TableRow className={classNameRowBorder}>
            <TableHead>Write-off</TableHead>
            <TableHead>w</TableHead>
            <TableHead>reason</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((item, idx) => (
            <TableRow key={idx} className="text-rd">
              <TableCell>{item.product}</TableCell>
              <TableCell>{item.weight}</TableCell>
              <TableCell>{item.reason}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  );
}
