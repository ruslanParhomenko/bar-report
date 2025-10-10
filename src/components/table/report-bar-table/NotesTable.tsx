import { Table, TableBody, TableCell, TableRow } from "../../ui/table";
import { classNameHead } from "./ReportBarTable";

export default function NotesTable({ data }: { data: string }) {
  return data ? (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell className={classNameHead}>notes:</TableCell>
          <TableCell>{data}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ) : (
    <div></div>
  );
}
