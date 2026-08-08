"use client";

import { GetTTNData } from "@/app/actions/ttn/ttn-actions";
import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import SelectDay from "@/components/select/select-day";
import { getMonthDays } from "@/utils/get-month-days";

type SupplierDayRow = {
  supplier: string;
  plus: string;
  minus: string;
};

export default function TTNDayPage({
  dataTtn,
  month,
  year,
}: {
  dataTtn: GetTTNData | null;
  month: string;
  year: string;
}) {
  const { monthDays } = getMonthDays({ month, year });

  const [selectedDay, setSelectedDay] = useState<string>(
    new Date().getDate().toString(),
  );
  const [selectedDayData, setSelectedDayData] = useState<SupplierDayRow[]>([]);

  const totalPlus = selectedDayData
    .reduce((acc, val) => acc + +val.plus, 0)
    .toFixed(2);
  const totalMinus = selectedDayData
    .reduce((acc, val) => acc + +val.minus, 0)
    .toFixed(2);

  useEffect(() => {
    if (!dataTtn?.ttnData?.rowSuppliers) return;

    const dayIndex = Number(selectedDay) - 1;

    const rows: SupplierDayRow[] = Object.entries(
      dataTtn.ttnData.rowSuppliers,
    ).map(([supplier, values]: any) => ({
      supplier,
      plus: values.plus?.[dayIndex] ?? "",
      minus: values.minus?.[dayIndex] ?? "",
    }));

    setSelectedDayData(rows);
  }, [dataTtn, selectedDay]);

  const middleIndex = Math.ceil(selectedDayData.length / 2);
  const firstTableData = selectedDayData.slice(0, middleIndex);
  const secondTableData = selectedDayData.slice(middleIndex);

  return (
    <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-4 print:grid-cols-2">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>day:</TableHead>
            <TableHead>
              <SelectDay
                value={selectedDay}
                onChange={setSelectedDay}
                monthDays={monthDays}
              />
            </TableHead>
            <TableHead>+</TableHead>
            <TableHead>-</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {firstTableData.map((row, index) => (
            <TableRow key={row.supplier}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{row.supplier}</TableCell>
              <TableCell>{row.plus || "-"}</TableCell>
              <TableCell>{row.minus || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div>
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>+</TableHead>
              <TableHead>-</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {secondTableData.map((row) => (
              <TableRow key={row.supplier}>
                <TableCell>{row.supplier}</TableCell>
                <TableCell>{row.plus || "-"}</TableCell>
                <TableCell>{row.minus || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Table className="w-full">
          <TableFooter>
            <TableRow>
              <TableHead>Итого</TableHead>
              <TableHead className="text-bl text-center">{totalPlus}</TableHead>
              <TableHead className="text-rd text-center">
                {totalMinus}
              </TableHead>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
