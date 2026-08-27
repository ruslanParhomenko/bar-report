"use client";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useMonthDays } from "@/hooks/use-month-days";
import { cn } from "@/lib/utils";
import { TTNForm } from "../model/schema";

export default function TtnViewBodyTable({
  data,
  normalizedSearch,
  setSelectedDay,
}: {
  data: TTNForm;
  normalizedSearch: string;
  setSelectedDay: (day: number) => void;
}) {
  const { monthDays } = useMonthDays();

  const currentDay = new Date().getDate();

  const sum = (arr?: Array<string | undefined>) =>
    (arr ?? []).reduce((acc, v) => acc + (Number(v ?? 0) || 0), 0);

  return (
    <TableBody>
      {Object.keys(data.rowSuppliers)
        .filter((row) => row.includes(normalizedSearch))
        .map((row) => {
          const rowData = data.rowSuppliers?.[row];
          const minusTotal = sum(rowData?.minus);
          const plusTotal = sum(rowData?.plus);

          const isRowByCurrentDay =
            data.rowSuppliers?.[row]?.plus?.[currentDay - 1];

          return (
            <TableRow
              key={row}
              className="group [&>td]:px-1 [&>td]:py-0 [&>td]:text-[11px]"
            >
              <TableCell className="w-18 border-r">
                <div className="flex h-full flex-col items-end">
                  <span
                    className={cn(
                      "text-rd",
                      minusTotal === 0 && "text-muted-foreground",
                    )}
                  >
                    {minusTotal.toFixed(2)}
                  </span>
                  <span
                    className={cn(
                      "text-bl",
                      plusTotal === 0 && "text-muted-foreground",
                    )}
                  >
                    {plusTotal.toFixed(2)}
                  </span>
                </div>
              </TableCell>
              <TableCell className="w-18 border-r">
                <div className="flex w-16 items-center">{rowData?.final}</div>
              </TableCell>

              <TableCell className="bg-background sticky left-0 text-start md:bg-transparent">
                <span
                  className={cn(
                    "hover-cell w-11 truncate font-semibold text-green-600",
                    isRowByCurrentDay && "text-rd",
                  )}
                >
                  {row}
                </span>
              </TableCell>
              <TableCell className="border-l px-0.5 py-0 text-right text-[10px]">
                {rowData?.start}
              </TableCell>
              {monthDays.map((_, dayIndex) => {
                const valuePlusDay = rowData?.plus?.[dayIndex];
                const valueMinusDay = rowData?.minus?.[dayIndex];
                return (
                  <TableCell key={dayIndex} className="border-x px-0.5 py-0">
                    <div className="flex w-full flex-col items-center text-[11px]">
                      <span
                        className={cn(
                          "text-rd",
                          +valueMinusDay === 0 && "text-muted-foreground",
                        )}
                      >
                        {valueMinusDay}
                      </span>
                      <span
                        className={cn(
                          "text-bl",
                          +valuePlusDay === 0 && "text-muted-foreground",
                        )}
                      >
                        {valuePlusDay}
                      </span>
                    </div>
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
    </TableBody>
  );
}
