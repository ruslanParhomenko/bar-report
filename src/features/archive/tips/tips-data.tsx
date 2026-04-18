"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { TipsAddData } from "@/app/actions/tips-add/tips-add-actions";
import { cn } from "@/lib/utils";
import { TipsAddFormValues } from "@/features/bar/tips-add/schema";
import { useTipsCalculation } from "@/hooks/use-tips-calculation";
export default function TipsData({ data }: { data: TipsAddData[] | null }) {
  const [opened, setOpened] = useState<number[]>([]);

  console.log(data);

  useEffect(() => {
    if (!data) return;
    if (reversed.length > 0) {
      setOpened([0]);
    }
  }, [data]);

  const toggle = (index: number) => {
    setOpened((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const mergeEmployees = (
    tipsAdd: TipsAddFormValues[],
  ): TipsAddFormValues[] => {
    const map = new Map();

    tipsAdd.forEach((emp) => {
      if (!map.has(emp.idEmployee)) {
        map.set(emp.idEmployee, {
          ...emp,
          amount: [...(emp.amount || [])],
        });
      } else {
        const existing = map.get(emp.idEmployee);
        existing.amount.push(...(emp.amount || []));
      }
    });

    return Array.from(map.values());
  };

  if (!data) return null;
  const reversed = data && [...data].reverse();

  return (
    <>
      {reversed.map((dayItem, index) => {
        const isOpen = opened.includes(index);

        const currencyDay = Number(dayItem.currency);

        const employees = mergeEmployees(dayItem.tipsAdd);

        const { totalTips, getEmployeeTotal, calcEmployeeTotal } =
          useTipsCalculation(employees, currencyDay);

        return (
          <Card
            key={index}
            className="bg-background! shadow-none m-2 cursor-pointer"
            onClick={() => toggle(index)}
          >
            <CardTitle className="text-xs p-4">
              day: {dayItem.day} :
              <span className="text-bl px-2">{totalTips.toFixed(0)}</span>
            </CardTitle>

            {isOpen && (
              <CardContent className="overflow-auto px-0">
                <Table className="md:table-fixed">
                  <TableBody>
                    {employees.map((emp: TipsAddFormValues, i: number) => {
                      const personalTotal = calcEmployeeTotal(emp.amount);

                      const personalResultAmount = emp.resultAmount
                        ?.reduce((acc, amount) => acc + amount.value, 0)
                        .toFixed(0);
                      return (
                        <TableRow
                          key={emp.idEmployee + "-time"}
                          className="hover:bg-gray-100!"
                        >
                          <TableCell className="w-3 pl-0 border-r text-start text-xs">
                            {i + 1}
                          </TableCell>
                          <TableCell className="w-9 text-green-600 font-bold text-center text-xs">
                            {personalResultAmount}
                          </TableCell>
                          <TableCell className="text-muted-foreground w-8 text-xs text-center">
                            {getEmployeeTotal(emp).toFixed(0)}
                          </TableCell>
                          <TableCell
                            className={cn(
                              "w-26 sticky left-0 z-10 bg-background md:bg-transparent text-xs",
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
                              "text-xs w-12",
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
                              "text-xs w-9 text-muted-foreground",
                            )}
                          >
                            {personalTotal.toFixed(0)}
                          </TableCell>

                          {emp.amount.map((a, i) => (
                            <TableCell key={i} className="group">
                              <div className="text-xs text-center text-muted-foreground group-hover:text-red-600">
                                {a.time}
                              </div>
                              <div
                                className={cn(
                                  "text-xs text-center font-medium",
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
