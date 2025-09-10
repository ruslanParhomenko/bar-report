"use client";
import { useEffect, useState } from "react";
import { useSheetData } from "@/hooks/use-schedule-data-google";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

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
    <Table className="border-collapse border-0">
      <TableBody>
        {data.map((row: any, i: number) => {
          const hasValueInSelected =
            selectedColumn !== null && row[selectedColumn];

          const noBorderRow = i === 0 || !row[3];

          return (
            <TableRow
              key={i}
              className={cn(
                "border-0 text-sm",
                theme === "dark" ? "text-foreground/45" : "text-bl"
              )}
            >
              {row.map((cell: any, j: number) => {
                const isSelected = j === 4 || j === 2;
                const isBlueColor =
                  i === 0 ||
                  i === 1 ||
                  i === data.length - 1 ||
                  j === 0 ||
                  j === 1 ||
                  j === 2;
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
                    className={`
                  h-10 w-9
                  ${noBorderRow ? "" : "border"}
                  ${
                    noBorderRow
                      ? ""
                      : `${
                          theme === "dark"
                            ? "border-border/40"
                            : "border-border"
                        }`
                  }
                  ${
                    isBlueColor
                      ? `${theme === "dark" ? "text-foreground/45" : "text-bl"}`
                      : ""
                  }
                  ${
                    isSelected
                      ? `${theme === "dark" ? "text-foreground/45" : "text-bl"}`
                      : ""
                  }
                  ${
                    j === 4
                      ? "min-w-[30px] sticky left-0 z-5 text-left bg-background"
                      : "text-center"
                  }
                  ${
                    isHighlighted
                      ? `${
                          theme === "dark"
                            ? "text-foreground font-bold"
                            : "font-bold text-rd"
                        }`
                      : ""
                  }
                  
                  ${i === 0 ? "cursor-pointer" : ""}
                  ${
                    shouldEmphasize
                      ? `${
                          theme === "dark"
                            ? "text-foreground font-bold"
                            : "font-bold text-rd"
                        }`
                      : ""
                  }
                `}
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
  );
}
