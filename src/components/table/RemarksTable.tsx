import { Remark, RemarkReport } from "@/generated/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DeleteListButton } from "../../features/archive/DeleteListButton";
import { REMARKS_ENDPOINT } from "@/constants/endpoint-tag";

type RemarkData = RemarkReport & { remarks: Remark[] };

export default function RemarksTable({ data }: { data: RemarkData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <DeleteListButton data={data} nameTag={REMARKS_ENDPOINT} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="text-gr">
              <TableCell>name</TableCell>
              <TableCell>day</TableCell>
              <TableCell>night</TableCell>
              <TableCell>penalty</TableCell>
              <TableCell>bonus</TableCell>
              <TableCell>reason</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.remarks.map((remark: Remark) => (
              <TableRow key={remark.id}>
                <TableCell className="md:min-w-2/8 sticky left-0 z-10 bg-card">
                  {remark.name}
                </TableCell>
                <TableCell className="md:w-1/8">{remark.dayHours}</TableCell>
                <TableCell className="md:w-1/8">{remark.nightHours}</TableCell>
                <TableCell className="md:w-1/8">{remark.penalty}</TableCell>
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
