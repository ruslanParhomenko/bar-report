import { Table, TableBody, TableCell, TableRow } from "../../ui/table";
import { classNameHead } from "./ReportBarTable";

export default function NotesTable({ data }: { data: string }) {
  return data ? (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell className={classNameHead}>
            notes: <span className="text-rd text-xs px-4">{data}</span>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ) : (
    <div></div>
  );
}
