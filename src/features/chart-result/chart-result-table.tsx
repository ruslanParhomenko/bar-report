"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { MONTHS } from "@/utils/get-month-days";
import { useState } from "react";
import { SUB_HEADERS } from "./constants";
import type { ChartDataItem, EmployeeTableRow, MonthData } from "./types";

export function ChartResultTable({
  tableData,
  monthsToDisplay,
  hasScheduleData,
  chartDataByEmployee,
}: {
  tableData: EmployeeTableRow[];
  monthsToDisplay: string[];
  hasScheduleData: (month: string) => boolean;
  chartDataByEmployee: ChartDataItem[];
}) {
  const [activeKeyMonthData, setActiveKeyMonthData] = useState<
    Record<keyof MonthData, boolean>
  >({
    rate: true,
    hours: true,
    salary: true,
    tips: true,
    total: true,
  });

  const subHeadersByFilter = SUB_HEADERS.filter(
    (key) => activeKeyMonthData[key],
  );

  return (
    <>
      <Table className="my-2">
        <TableHeader>
          <TableRow className="[&>th]:h-5! [&>th]:p-0!">
            <TableHead className="bg-background sticky left-0 z-10" />
            <TableHead />

            {monthsToDisplay.map((month) => (
              <TableHead
                key={month}
                colSpan={subHeadersByFilter.length}
                className={cn("border-l p-0 text-center text-xs")}
              >
                {month.slice(0, 3)}
              </TableHead>
            ))}
          </TableRow>
          <TableRow className="[&>th]:h-6! [&>th]:p-0!">
            <TableHead className="bg-background sticky left-0 z-10" />
            <TableHead className="text-bl p-0 text-center text-xs">W</TableHead>
            {monthsToDisplay.map((month) => {
              const hasData = hasScheduleData(month);
              if (!hasData) return null;
              return subHeadersByFilter.map((subHeader) => (
                <TableHead
                  key={`${month}-${subHeader}`}
                  className={cn(
                    "p-0 text-center text-xs",
                    !hasData && "bg-muted/50",
                  )}
                >
                  {subHeader.slice(0, 1).toUpperCase()}
                </TableHead>
              ));
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row, idx) => {
            const workedMonths =
              chartDataByEmployee.find(
                (emp) => emp.name.trim() === row.employee.trim(),
              )?.workedMonths || 0;

            return (
              <TableRow
                key={idx}
                className={cn(
                  "[&>td]:py-1.5 [&>td]:text-xs print:[&>td]:py-3",
                  idx % 2 === 0 && "bg-gray-100",
                  tableData.length < 16 && "[&>td]:py-3",
                )}
              >
                <TableCell className="bg-background sticky left-0 z-10 md:bg-transparent print:text-sm!">
                  {row.employee}
                </TableCell>
                <TableCell>{workedMonths || ""}</TableCell>
                {monthsToDisplay.map((month, monthIdx) => {
                  const monthData = row[month] as MonthData | undefined;
                  const hasData = hasScheduleData(month);
                  const isLastMonth = monthIdx === MONTHS.length - 1;

                  return subHeadersByFilter.map((subHeader, subIdx) => {
                    const isLastSubHeader =
                      subIdx === subHeadersByFilter.length - 1;

                    return (
                      <TableCell
                        key={`${row.employee}-${month}-${subHeader}`}
                        className={cn(
                          "border-l px-1 text-center text-xs",
                          !hasData && "bg-muted/30",
                          monthData?.total === 0 && "border-l-0!",
                          isLastSubHeader &&
                            !isLastMonth &&
                            "border-r-2 border-r-slate-400",
                          (subHeader === "total" || subHeader === "rate") &&
                            "font-semibold",
                        )}
                      >
                        {monthData && monthData[subHeader]
                          ? monthData[subHeader].toFixed(0)
                          : ""}
                      </TableCell>
                    );
                  });
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="flex flex-wrap justify-center gap-1 md:px-4">
        {SUB_HEADERS.map((key) => (
          <span
            key={key}
            onClick={() =>
              setActiveKeyMonthData((prev) => ({ ...prev, [key]: !prev[key] }))
            }
            className={cn(
              "text-rd cursor-pointer rounded-full px-2 py-1 text-xs font-bold transition-opacity md:px-6",
              !activeKeyMonthData[key] && "opacity-35",
              activeKeyMonthData[key] && "print:hidden",
            )}
          >
            {key}
          </span>
        ))}
      </div>
    </>
  );
}
