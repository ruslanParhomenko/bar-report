import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  classNameHeadCucina,
  classNameRowBorderCucina,
} from "./ReportCucinaTable";

export default function NotesTable({ data }: { data: string }) {
  return data ? (
    <Table>
      <TableHeader>
        <TableRow className={classNameRowBorderCucina}>
          <TableHead>Notes:</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>{data}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ) : null;
}
