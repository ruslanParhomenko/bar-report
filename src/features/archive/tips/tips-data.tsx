"use client";

import { useEffect, useState, useMemo, Fragment } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { TipsAddData } from "@/app/actions/tips-add/tips-add-actions";
import { cn } from "@/lib/utils";

export default function TipsData({ data }: { data: TipsAddData[] | null }) {
  const [opened, setOpened] = useState<number[]>([]);

  const reversed = useMemo(() => {
    if (!data) return [];
    return [...data].reverse();
  }, [data]);

  useEffect(() => {
    if (reversed.length > 0) {
      setOpened([0]);
    }
  }, [reversed]);

  const toggle = (index: number) => {
    setOpened((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  // 🔥 merge employees
  const mergeEmployees = (tipsAdd: any[]) => {
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

  return (
    <>
      {reversed.map((dayItem, index) => {
        const isOpen = opened.includes(index);

        const employees = useMemo(
          () => mergeEmployees(dayItem.tipsAdd),
          [dayItem.tipsAdd],
        );

        return (
          <Card
            key={index}
            className="bg-background! shadow-none m-2 cursor-pointer"
            onClick={() => toggle(index)}
          >
            <CardTitle className="text-xs p-4">day: {dayItem.day}</CardTitle>

            {isOpen && (
              <CardContent>
                <Table>
                  <TableBody>
                    {employees.map((emp: any) => (
                      <Fragment key={emp.idEmployee}>
                        {/* row 1: TIME */}
                        <TableRow key={emp.idEmployee + "-time"}>
                          <TableCell
                            rowSpan={2}
                            className="align-top font-medium w-40"
                          >
                            <div>{emp.employeeName}</div>
                            <div className="text-xs text-muted-foreground">
                              {emp.shift}
                            </div>
                          </TableCell>

                          {emp.amount.map((a: any, i: number) => (
                            <TableCell
                              key={i}
                              className="text-xs text-center text-muted-foreground"
                            >
                              {a.time}
                            </TableCell>
                          ))}
                        </TableRow>

                        {/* row 2: VALUE */}
                        <TableRow key={emp.idEmployee + "-value"}>
                          {emp.amount.map((a: any, i: number) => (
                            <TableCell
                              key={i}
                              className={cn(
                                "text-xs text-center font-medium",
                                a.typeAmount === "mdl" && "text-green-600",
                                a.typeAmount === "chips" && "text-blue-600",
                              )}
                            >
                              {a.value} {a.typeAmount}
                            </TableCell>
                          ))}
                        </TableRow>
                      </Fragment>
                    ))}
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
