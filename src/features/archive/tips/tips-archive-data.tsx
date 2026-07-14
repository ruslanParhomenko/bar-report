"use client";

import { GetTipsAddData } from "@/app/actions/tips-add/tips-add-actions";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { TipsAddForm } from "@/features/bar/tips-add/schema";

import { useTipsCalculation } from "@/hooks/use-tips-calculation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const HOURS_MS = 3600000;
export default function TipsArchiveData({
  data,
}: {
  data: GetTipsAddData[] | null;
}) {
  const [opened, setOpened] = useState<number[]>([]);

  const sorted = data
    ? [...data].sort((a, b) => Number(b.id) - Number(a.id))
    : [];

  useEffect(() => {
    if (!data) return;
    if (sorted.length > 0) {
      setOpened([0]);
    }
  }, [data]);

  const toggle = (index: number) => {
    setOpened((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  if (!data) return null;

  const formatTime = (ms: number) => {
    const date = new Date(ms);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <>
      {sorted.map((dayItem, index) => {
        const isOpen = opened.includes(index);

        const currencyDay = Number(dayItem.currency);

        const employees = dayItem.tipsAdd;

        const { totalTips, getEmployeeTotal, calcEmployeeTotal } =
          useTipsCalculation(employees, currencyDay);

        const totalMdl = employees.reduce(
          (sum, emp) =>
            sum +
            +emp.amount
              .filter((a) => a.typeAmount === "mdl")
              .reduce((s, a) => s + +a.value, 0),
          0,
        );

        const totalChips = employees.reduce(
          (sum, emp) =>
            sum +
            +emp.amount
              .filter((a) => a.typeAmount === "chips")
              .reduce((s, a) => s + +a.value, 0),
          0,
        );

        return (
          <Card
            key={index}
            className="bg-background! my-2 cursor-pointer shadow-none md:m-2"
            onClick={() => toggle(index)}
          >
            <CardTitle className="p-4 text-xs">
              <span className="pr-4">day: {dayItem.id} :</span>
              <span className="text-bl px-2">tips: {totalTips.toFixed(0)}</span>
              <span className="px-2 text-green-600">
                _mdl: {totalMdl.toFixed(0)}
              </span>
              <span className="px-2 text-blue-600">
                _chips: {totalChips.toFixed(0)}
              </span>
              <span className="text-bl px-2">
                _$: {dayItem.currency.slice(0, 5)}
              </span>
            </CardTitle>

            {isOpen && (
              <CardContent className="overflow-auto">
                <Table className="md:table-fixed">
                  <TableBody>
                    {employees.map((emp: TipsAddForm, i: number) => {
                      const personalTotal = calcEmployeeTotal(emp.amount);

                      const personalResultAmount = emp.resultAmount
                        ?.reduce((acc, amount) => acc + amount.value, 0)
                        .toFixed(0);
                      return (
                        <TableRow
                          key={emp.idEmployee + "-time"}
                          className="hover:bg-gray-100!"
                        >
                          <TableCell className="text-muted-foreground w-2 pl-0 text-start text-xs">
                            {i + 1}
                          </TableCell>
                          <TableCell className="w-6 text-center text-xs font-bold text-green-600 md:w-8">
                            {personalResultAmount}
                          </TableCell>

                          <TableCell className="text-yl w-5 text-xs">
                            {emp.shift.split("-")[0]}
                          </TableCell>
                          <TableCell
                            className={cn(
                              "bg-background sticky left-0 z-10 w-24 text-xs md:bg-transparent",
                              emp.role === "barmen" && "text-bl",
                            )}
                          >
                            {emp.employeeName.split(" ")[0]}{" "}
                            {emp.employeeName.split(" ")[1].charAt(0)}
                            {". "}
                            {emp.role.charAt(0)}
                          </TableCell>
                          <TableCell
                            className={cn(
                              emp.role === "barmen" && "text-bl",
                              "w-22 text-xs",
                              emp.over && emp.over > 0 && "text-red-600",
                            )}
                          >
                            {formatTime(emp.createdAt)} -
                            {formatTime(emp.endDate)}
                            {emp.over && emp.over > 0
                              ? `+${emp.over / HOURS_MS}`
                              : ""}
                          </TableCell>
                          <TableCell
                            className={cn(
                              emp.role === "barmen" && "text-bl",
                              "text-muted-foreground w-7 text-xs",
                            )}
                          >
                            {personalTotal.toFixed(0)}
                          </TableCell>

                          {/* Единственная ячейка вместо переменного числа TableCell — 
                              так количество колонок в таблице всегда одинаковое, 
                              и table-layout: fixed больше не "сжимает" остальные колонки */}
                          <TableCell className="min-w-0">
                            <div className="flex gap-1 md:flex-wrap">
                              {emp.amount.map((a, i) => (
                                <div key={i} className="group w-12 shrink-0">
                                  <div className="text-muted-foreground text-center text-xs group-hover:text-red-600">
                                    {a.time}
                                  </div>
                                  <div
                                    className={cn(
                                      "text-center text-xs font-medium",
                                      a.typeAmount === "mdl" &&
                                        "text-green-600",
                                      a.typeAmount === "chips" &&
                                        "text-blue-600",
                                    )}
                                  >
                                    {a.value}{" "}
                                    {a.typeAmount === "mdl" ? "" : "$"}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            )}
          </Card>
        );
      })}
    </>
  );
}
