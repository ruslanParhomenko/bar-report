import { Remarks } from "@/generated/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function RemarksTable({ data }: { data: Remarks[] }) {
  const filtered = data?.filter(
    (remark) =>
      remark.name?.trim() ||
      remark.dayHours?.trim() ||
      remark.nightHours?.trim() ||
      remark.penality?.trim() ||
      remark.reason?.trim()
  );

  if (!filtered?.length) return null;
  return (
    <div className="p-4 border rounded-md shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="text-gr">
            <TableCell>name</TableCell>
            <TableCell>day</TableCell>
            <TableCell>night</TableCell>
            <TableCell>penality</TableCell>
            <TableCell>reason</TableCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filtered.map((remark) => (
            <TableRow key={remark.id}>
              <TableCell className="md:min-w-2/8">{remark.name}</TableCell>
              <TableCell className="md:w-1/8">{remark.dayHours}</TableCell>
              <TableCell className="md:w-1/8">{remark.nightHours}</TableCell>
              <TableCell className="md:w-1/8">{remark.penality}</TableCell>
              <TableCell className="md:w-2/8">{remark.reason}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
