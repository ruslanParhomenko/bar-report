"use client";
import { Card } from "@/components/ui/card";
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
    <Card className="rounded-2xl shadow-sm  p-6 h-screen flex flex-col">
      {/* Заголовок таблицы */}
      <div className="flex-shrink-0">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow>
              <TableHead>ПФ</TableHead>
              <TableHead className="text-center truncate">
                холодильник +2…+3°C
              </TableHead>
              <TableHead className="text-center">морозилка -18°C</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </div>

      {/* Контент таблицы с прокруткой, но без видимой полосы */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {" "}
        <Table className="table-fixed w-full">
          <TableBody>
            {data &&
              data
                ?.filter((emp: any, idx: number) => idx !== 0)
                .map((emp: any, idx: number) => (
                  <TableRow key={`${emp.date}-${idx}`}>
                    <TableCell className="truncate">{emp.name}</TableCell>
                    <TableCell className="text-center truncate">
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
    </Card>
  );
}
