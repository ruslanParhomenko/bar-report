"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { GetTipsAddData } from "@/features/tips-add/model/type";
import { useMonthDays } from "@/hooks/use-month-days";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Row = {
  name: string;
  role: string;
  byDay: Map<number, number>;
};

export default function TipsArchiveMatrix({
  data,
}: {
  data: GetTipsAddData[];
}) {
  const { monthDays } = useMonthDays();
  const [selectedDay, setSelectedDay] = useState(() => new Date().getDate());

  const byEmployee = new Map<string, Row>();

  for (const dayItem of data) {
    const day = Number(dayItem.id);

    for (const emp of dayItem.tipsAdd) {
      const sum = emp.resultAmount?.reduce((acc, a) => acc + a.value, 0) ?? 0;
      const role = emp.role ?? "";
      const key = `${role}|${emp.employeeName}`;

      const row = byEmployee.get(key) ?? {
        name: emp.employeeName,
        role,
        byDay: new Map<number, number>(),
      };
      row.byDay.set(day, (row.byDay.get(day) ?? 0) + sum);
      byEmployee.set(key, row);
    }
  }

  const rows = [...byEmployee.values()].sort(
    (a, b) => a.role.localeCompare(b.role) || a.name.localeCompare(b.name),
  );

  const dayTotals = new Map<number, number>();
  for (const { byDay } of rows) {
    for (const [day, v] of byDay) {
      dayTotals.set(day, (dayTotals.get(day) ?? 0) + v);
    }
  }
  const grandTotal = [...dayTotals.values()].reduce((acc, v) => acc + v, 0);

  return (
    <Table className="table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="bg-background sticky left-0 z-20 w-8 px-1 text-xs" />

          <TableHead className="bg-background sticky left-8 z-20 w-10 px-1 text-center text-xs" />

          <TableHead className="bg-background sticky left-18 z-20 w-26 text-xs" />

          {monthDays.map((_, i) => (
            <TableHead
              key={i}
              onClick={() => setSelectedDay(i + 1)}
              className={cn(
                "w-9 min-w-9 cursor-pointer px-1 text-center text-xs",
                selectedDay === i + 1 && "text-rd font-bold",
              )}
            >
              {i + 1}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {rows.map(({ name, role, byDay }, rowIndex) => {
          const hasSelected = byDay.has(selectedDay);
          const total = [...byDay.values()].reduce((acc, v) => acc + v, 0);

          return (
            <TableRow
              key={name}
              className="group hover:bg-muted-foreground/10 [&>td]:border-x"
            >
              <TableCell className="bg-background text-gn group-hover:text-rd sticky left-0 z-10 border-l-0! px-1 text-xs md:bg-transparent">
                {rowIndex + 1}
              </TableCell>
              <TableCell className="bg-background text-gr group-hover:text-rd sticky left-8 z-10 px-1 text-center text-xs font-bold md:bg-transparent">
                {total.toFixed(0)}
              </TableCell>
              <TableCell
                className={cn(
                  "bg-background group-hover:text-rd sticky left-18 z-10 min-w-28 text-xs group-hover:font-bold md:bg-transparent",
                  hasSelected && "text-rd! font-bold",
                  role === "waiters" ? "text-bl" : "text-muted-foreground",
                )}
              >
                {name}
              </TableCell>
              {monthDays.map((_, i) => {
                const value = byDay.get(i + 1);
                const isSelected = i + 1 === selectedDay;
                return (
                  <TableCell
                    key={i}
                    className={cn(
                      "group-hover:text-rd px-1 text-center text-xs group-hover:font-bold",
                      isSelected && "text-rd! font-bold",
                    )}
                  >
                    {value !== undefined ? value.toFixed(0) : ""}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
        <TableRow className="bg-muted/40 [&>td]:text-bl h-12 font-bold [&>td]:border-x [&>td]:border-b">
          <TableCell className="bg-background sticky left-0 z-10 border-l-0! px-1 text-xs md:bg-transparent" />
          <TableCell className="bg-background text-gr sticky left-8 z-10 px-1 text-center text-xs font-bold md:bg-transparent">
            {grandTotal.toFixed(0)}
          </TableCell>
          <TableCell className="bg-background sticky left-18 z-10 min-w-28 text-xs font-bold md:bg-transparent"></TableCell>
          {monthDays.map((_, i) => {
            const value = dayTotals.get(i + 1);
            const isSelected = i + 1 === selectedDay;
            return (
              <TableCell
                key={i}
                className={cn(
                  "px-1 text-center text-xs font-bold",
                  isSelected && "text-rd!",
                )}
              >
                {value !== undefined ? value.toFixed(0) : ""}
              </TableCell>
            );
          })}
        </TableRow>
      </TableBody>
    </Table>
  );
}
