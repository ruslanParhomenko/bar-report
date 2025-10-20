"use client";
import { useEffect, useState } from "react";
import { useSheetData } from "@/hooks/use-schedule-data-google";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export function ScheduleTable({ dataRange }: { dataRange: any }) {
  const { theme } = useTheme();
  const { data } = useSheetData({ range: dataRange as string });
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null);
  const todayDay = new Date().getDate();

  useEffect(() => {
    if (data && data.length > 0) {
      const firstRow = data[0];
      const index = firstRow.findIndex(
        (cell: any) => String(cell) === String(todayDay)
      );
      if (index !== -1) {
        setSelectedColumn(index);
      }
    }
  }, [data, todayDay]);
  return (
    <Card className="w-[90vw] md:pr-12">
      <Table>
        <TableBody>
          {data.map((row: any, i: number) => {
            const hasValueInSelected =
              selectedColumn !== null && row[selectedColumn];

            return (
              <TableRow
                key={i}
                className={cn(
                  theme === "dark" ? "text-foreground/45" : "",
                  "border-border",
                  (i === 0 || i === 1) && "cursor-pointer  border-0 "
                )}
              >
                {row.map((cell: any, j: number) => {
                  const noBorder = cell === "";
                  const isSelected = j === 4 || j === 2;

                  const isHighlighted = selectedColumn === j;
                  const shouldEmphasize =
                    isSelected && hasValueInSelected && i !== 0;

                  return (
                    <TableCell
                      key={j}
                      onClick={() => {
                        if (i === 0) {
                          setSelectedColumn((prev) => (prev === j ? null : j));
                        }
                      }}
                      className={cn(
                        noBorder
                          ? "border-x border-t border-b !p-0"
                          : "border-x border-t border-b ",
                        theme === "dark"
                          ? "border-border/40 text-foreground/40"
                          : "border-border text-bl",
                        j === 4
                          ? "min-w-[30px] sticky left-0 z-5 text-left bg-background"
                          : "text-center",
                        isHighlighted &&
                          (theme === "dark"
                            ? "text-foreground font-bold"
                            : "font-bold text-rd"),
                        (i === 0 || i === 1) && "cursor-pointer border-0 !p-1",
                        shouldEmphasize &&
                          (theme === "dark"
                            ? "text-foreground font-bold"
                            : "font-bold text-rd")
                      )}
                    >
                      {cell}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
