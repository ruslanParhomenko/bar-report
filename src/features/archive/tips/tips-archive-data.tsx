"use client";

import { GetTipsAddData } from "@/app/actions/tips-add/tips-add-actions";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { TipsAddForm } from "@/features/bar/tips-add/schema";

import { useTipsCalculation } from "@/hooks/use-tips-calculation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
export default function TipsArchiveData({
  data,
}: {
  data: GetTipsAddData[] | null;
}) {
  const [opened, setOpened] = useState<number[]>([]);

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
  const sorted = data
    ? [...data].sort((a, b) => Number(b.id) - Number(a.id))
    : [];
  return (
    <>
      {sorted.map((dayItem, index) => {
        const isOpen = opened.includes(index);

        const currencyDay = Number(dayItem.currency);

        const employees = dayItem.tipsAdd;

        const { totalTips, getEmployeeTotal, calcEmployeeTotal } =
          useTipsCalculation(employees, currencyDay);

        return (
          <Card
            key={index}
            className="bg-background! cursor-pointer shadow-none md:m-2"
            onClick={() => toggle(index)}
          >
            <CardTitle className="p-2 text-xs">
              <span className="pr-4">day: {dayItem.id} :</span>
              <span className="text-bl px-2">
                total tips: {totalTips.toFixed(0)}
              </span>
              <span className="text-bl px-2">
                currency: {dayItem.currency.slice(0, 5)}
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
                          <TableCell className="text-muted-foreground w-3 pl-0 text-start text-xs">
                            {i + 1}
                          </TableCell>
                          <TableCell className="w-9 text-center text-xs font-bold text-green-600">
                            {personalResultAmount}
                          </TableCell>
                          <TableCell className="text-muted-foreground w-8 text-center text-xs">
                            {getEmployeeTotal(emp).toFixed(0)}
                          </TableCell>
                          <TableCell
                            className={cn(
                              "bg-background sticky left-0 z-10 w-26 text-xs md:bg-transparent",
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
                              "w-12 text-xs",
                            )}
                          >
                            {emp.shift.split("-")[0]} -
                            {emp.endDate
                              ? new Date(emp.endDate).getHours()
                              : ""}
                          </TableCell>
                          <TableCell
                            className={cn(
                              emp.role === "barmen" && "text-bl",
                              "text-muted-foreground w-9 text-xs",
                            )}
                          >
                            {personalTotal.toFixed(0)}
                          </TableCell>

                          {emp.amount.map((a, i) => (
                            <TableCell key={i} className="group">
                              <div className="text-muted-foreground text-center text-xs group-hover:text-red-600">
                                {a.time}
                              </div>
                              <div
                                className={cn(
                                  "text-center text-xs font-medium",
                                  a.typeAmount === "mdl" && "text-green-600",
                                  a.typeAmount === "chips" && "text-blue-600",
                                )}
                              >
                                {a.value} {a.typeAmount === "mdl" ? "" : "$"}
                              </div>
                            </TableCell>
                          ))}
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
