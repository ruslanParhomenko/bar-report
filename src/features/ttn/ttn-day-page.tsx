"use client";

import { TTNGetDataType } from "@/app/actions/ttn/ttn-actions";
import { useEffect, useRef, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Select, SelectContent, SelectTrigger } from "@/components/ui/select";

import { getMonthDays } from "@/utils/getMonthDays";
import PrintButton from "@/components/buttons/PrintButton";

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
  const componentRef = useRef<HTMLDivElement>(null);

  const monthDays = getMonthDays({ month, year });

  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [selectedDayData, setSelectedDayData] = useState<SupplierDayRow[]>([]);

  const totalPlus = selectedDayData.reduce((acc, val) => acc + +val.plus, 0);
  const totalMinus = selectedDayData.reduce((acc, val) => acc + +val.minus, 0);

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
    <>
      <PrintButton
        componentRef={componentRef}
        className=""
        formatPage="A4 portrait"
      />
      <div
        ref={componentRef}
        className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-10 w-full print:grid-cols-2"
      >
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>
                <Select>
                  <SelectTrigger className="w-24 h-8! border-0 shadow-none  rounded-md  md:text-md text-xs [&>svg]:hidden justify-between">
                    <span className="text-sm text-bl">выбрать день:</span>
                    <span className="text-sm text-rd">{selectedDay}</span>
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
              </TableHead>
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
                <TableHead className="text-center">{totalPlus}</TableHead>
                <TableHead className="text-center">{totalMinus}</TableHead>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </>
  );
}
