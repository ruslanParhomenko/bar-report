"use client";

import { TTNGetDataType } from "@/app/actions/ttn/ttn-actions";
import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getMonthDays } from "@/utils/getMonthDays";

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
  dataTtn: TTNGetDataType | null;
  month: string;
  year: string;
}) {
  const monthDays = getMonthDays({ month, year });

  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [selectedDayData, setSelectedDayData] = useState<SupplierDayRow[]>([]);

  useEffect(() => {
    if (!dataTtn?.rowSuppliers) return;

    const dayIndex = selectedDay - 1;

    const rows: SupplierDayRow[] = Object.entries(dataTtn.rowSuppliers).map(
      ([supplier, values]: any) => ({
        supplier,
        plus: values.plus?.[dayIndex] ?? "",
        minus: values.minus?.[dayIndex] ?? "",
      })
    );

    setSelectedDayData(rows);
  }, [dataTtn, selectedDay]);

  const middleIndex = Math.ceil(selectedDayData.length / 2);
  const firstTableData = selectedDayData.slice(0, middleIndex);
  const secondTableData = selectedDayData.slice(middleIndex);

  return (
    <div className="w-full space-y-6">
      <Select>
        <SelectTrigger className="w-[120px] justify-between">
          <span className="text-sm">{selectedDay}</span>
        </SelectTrigger>

        <SelectContent position="popper" className="p-2">
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: monthDays.length }, (_, i) => {
              const day = i + 1;
              const isSelected = day === selectedDay;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={[
                    "h-9 w-9 rounded-md text-sm transition",
                    "hover:bg-accent hover:text-accent-foreground",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted",
                  ].join(" ")}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </SelectContent>
      </Select>
      <div className="grid grid-cols-2 gap-10 w-full">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>+</TableHead>
              <TableHead>-</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {firstTableData.map((row) => (
              <TableRow key={row.supplier}>
                <TableCell>{row.supplier}</TableCell>
                <TableCell>{row.plus || "-"}</TableCell>
                <TableCell>{row.minus || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
      </div>
    </div>
  );
}
