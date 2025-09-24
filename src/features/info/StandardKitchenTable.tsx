"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGoogleData } from "@/hooks/useGoogleData";

export function StandardKitchenTable() {
  const { sk: data } = useGoogleData();
  return (
    <Table className="table-fixed w-full">
      <TableHeader>
        <TableRow>
          <TableHead className="w-20">ПФ</TableHead>
          <TableHead className="w-10 text-center truncate">
            холодильник +2…+3°C
          </TableHead>
          <TableHead className="truncate w-10 text-center">
            морозилка -18°C
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data &&
          data
            ?.filter((emp: any, idx: number) => idx !== 0)
            .map((emp: any, idx: number) => (
              <TableRow key={`${emp.date}-${idx}`}>
                <TableCell className="truncate">{emp.name}</TableCell>
                <TableCell className=" text-center truncate">
                  {emp.timePlus ?? "-"}
                </TableCell>
                <TableCell className="text-center">
                  {emp.timeMinus ?? "-"}
                </TableCell>
              </TableRow>
            ))}
      </TableBody>
    </Table>
  );
}
