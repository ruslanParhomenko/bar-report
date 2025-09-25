import { DeleteListButton } from "@/components/buttons/DeleteListButton";
import {
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { REMARKS_ENDPOINT } from "@/constants/endpoint-tag";
import React from "react";

export default function RemarksTable({ data }: { data: any[] }) {
  return (
    <>
      {data.length > 0 &&
        data.map((item: any, index: number) => (
          <React.Fragment key={index}>
            <DeleteListButton data={item} nameTag={REMARKS_ENDPOINT} />
            <div className="p-4 border rounded-md shadow-md">
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
                  {item?.remarks.map((remark: any) => {
                    if (!remark.name) return null;
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
          </React.Fragment>
        ))}
    </>
  );
}
