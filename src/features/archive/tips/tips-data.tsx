"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { TipsAddData } from "@/app/actions/tips-add/tips-add-actions";
import { cn } from "@/lib/utils";
import { TipsAddFormValues } from "@/features/bar/tips-add/schema";

export default function TipsData({ data }: { data: TipsAddData[] | null }) {
  const [opened, setOpened] = useState<number[]>([]);

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

        const numWaiters = employees.filter(
          (emp) => emp.role === "waiters",
        ).length;

        const totalAmountWaiters = employees
          .filter((emp) => emp.role === "waiters")
          .reduce((acc: number, emp) => {
            const empTotal = (emp.amount || []).reduce(
              (
                sum: number,
                amount: {
                  time: string;
                  typeAmount: string;
                  value: string;
                },
              ) => {
                if (amount.typeAmount === "mdl") {
                  return sum + Number(amount.value);
                }
                if (amount.typeAmount === "chips") {
                  return sum + Number(amount.value) * currencyDay;
                }
                return sum;
              },
              0,
            );

            return acc + empTotal;
          }, 0);
        const totalAmountBarmen = employees
          .filter((emp) => emp.role === "barmen")
          .reduce((acc: number, emp) => {
            const empTotal = (emp.amount || []).reduce(
              (
                sum: number,
                amount: {
                  time: string;
                  typeAmount: string;
                  value: string;
                },
              ) => {
                if (amount.typeAmount === "mdl") {
                  return sum + Number(amount.value);
                }
                if (amount.typeAmount === "chips") {
                  return sum + Number(amount.value) * currencyDay;
                }
                return sum;
              },
              0,
            );

            return acc + empTotal;
          }, 0);

        const portionTips = Number(
          (totalAmountWaiters / numWaiters).toFixed(0),
        );

        return (
          <Card
            key={index}
            className="bg-background! shadow-none m-2 cursor-pointer"
            onClick={() => toggle(index)}
          >
            <CardTitle className="text-xs p-4">
              day: {dayItem.day} :
              <span className="text-bl px-2">
                {(totalAmountWaiters + totalAmountBarmen).toFixed(0)}
              </span>
            </CardTitle>

            {isOpen && (
              <CardContent>
                <Table className="md:table-fixed">
                  <TableBody>
                    {employees.map((emp: TipsAddFormValues, i: number) => {
                      const personalTotal = emp.amount.reduce(
                        (
                          acc: number,
                          amount: {
                            time: string;
                            typeAmount: string;
                            value: string;
                          },
                        ) => {
                          if (amount.typeAmount === "mdl") {
                            acc += Number(amount.value);
                          } else if (amount.typeAmount === "chips") {
                            acc += Number(amount.value) * currencyDay;
                          }
                          return acc;
                        },
                        0,
                      );
                      return (
                        <TableRow
                          key={emp.idEmployee + "-time"}
                          className="hover:bg-gray-100!"
                        >
                          <TableCell className="w-5">{i + 1}</TableCell>
                          <TableCell className="text-green-600 font-bold w-12">
                            {emp.role === "waiters"
                              ? (personalTotal / 2 + portionTips).toFixed(0)
                              : personalTotal.toFixed(0)}
                          </TableCell>
                          <TableCell
                            className={cn(
                              "w-36 sticky left-0 z-10 bg-background md:bg-transparent",
                              emp.role === "barmen" && "text-bl",
                            )}
                          >
                            {emp.employeeName}
                          </TableCell>
                          <TableCell
                            className={cn(
                              emp.role === "barmen" && "text-bl",
                              "text-xs w-12",
                            )}
                          >
                            {emp.shift}
                          </TableCell>
                          <TableCell
                            className={cn(
                              emp.role === "barmen" && "text-bl",
                              "text-xs w-12 text-muted-foreground",
                            )}
                          >
                            {personalTotal.toFixed(0)}
                          </TableCell>
                          {emp.amount.map((a, i) => (
                            <TableCell key={i}>
                              <div className="text-xs text-center text-muted-foreground">
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
