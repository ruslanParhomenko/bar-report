"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useStandartKitchen } from "@/hooks/useGoogleStandartKitchen";

export function StandardKitchenForm() {
  const { data } = useStandartKitchen();

  if (!data) return null;

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
            {data?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  no datafound
                </TableCell>
              </TableRow>
            ) : (
              data
                ?.filter((emp: any, idx: number) => idx > 0)
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
                ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
