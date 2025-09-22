import {
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";

export default function RemarksTable({ data }: { data: any }) {
  return (
    <div className="p-4 border rounded-md shadow-md ">
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>name</TableCell>
            <TableCell>day hours</TableCell>
            <TableCell>night hours</TableCell>
            <TableCell>penality</TableCell>
            <TableCell>reason</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.remarks.map((remark: any) => {
            if (!remark.name) return;
            return (
              <TableRow key={remark.id}>
                <TableCell>{remark.name || "-"}</TableCell>
                <TableCell>{remark.dayHours || "-"}</TableCell>
                <TableCell>{remark.nightHours || "-"}</TableCell>
                <TableCell>{remark.penality || "-"}</TableCell>
                <TableCell>{remark.reason || "-"}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
