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
    <div className="w-full p-2 flex flex-col items-center space-y-4">
      {/* Таблица */}
      <div className="w-full md:w-4/5">
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
              data?.map((emp: any, idx: number) => (
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
      </div>
    </div>
  );
}
