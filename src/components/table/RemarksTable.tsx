import { Remark } from "@/generated/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DeleteListButton } from "../buttons/DeleteListButton";
import { REMARKS_ENDPOINT } from "@/constants/endpoint-tag";
import { RemarkData } from "@/constants/type";

export default function RemarksTable({
  data,
  invalidate,
}: {
  data: RemarkData;
  invalidate?: () => void;
}) {
  const filtered = data?.remarks?.filter(
    (remark: Remark) =>
      remark.name?.trim() ||
      remark.dayHours?.trim() ||
      remark.nightHours?.trim() ||
      remark.penality?.trim() ||
      remark.reason?.trim()
  );

  if (!filtered?.length) return null;
  return (
    <Card className="shadow-md border rounded-2xl md:p-4 mb-4">
      <CardHeader>
        <CardTitle>
          <DeleteListButton
            data={data}
            nameTag={REMARKS_ENDPOINT}
            invalidate={invalidate}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="text-gr">
              <TableCell>name</TableCell>
              <TableCell>day</TableCell>
              <TableCell>night</TableCell>
              <TableCell>penality</TableCell>
              <TableCell>bonus</TableCell>
              <TableCell>reason</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.map((remark: Remark) => (
              <TableRow key={remark.id}>
                <TableCell className="md:min-w-2/8 sticky left-0 bg-background/90">
                  {remark.name}
                </TableCell>
                <TableCell className="md:w-1/8">{remark.dayHours}</TableCell>
                <TableCell className="md:w-1/8">{remark.nightHours}</TableCell>
                <TableCell className="md:w-1/8">{remark.penality}</TableCell>
                <TableCell className="md:w-1/8">{remark.bonus}</TableCell>
                <TableCell className="md:w-2/8">{remark.reason}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
