"use client";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useMonthDays } from "@/hooks/use-month-days";
import { cn } from "@/lib/utils";
import { handleMultiTableNavigation } from "@/utils/handle-table-navigation";
import { useFormContext, useWatch } from "react-hook-form";
import { TTNFormNBM } from "../model/schema";

export default function TtnNbmBodyTable({
  arrayRows,
  disabled,
  setSelectedDay,
}: {
  arrayRows: string[];
  disabled?: boolean;
  setSelectedDay: (day: number) => void;
}) {
  const { register, control } = useFormContext<TTNFormNBM>();

  const { monthDays } = useMonthDays();

  const value = useWatch({
    control: control,
    name: "rowSuppliers",
  });

  const sum = (arr?: Array<string | undefined>) =>
    (arr ?? []).reduce((acc, v) => acc + (Number(v ?? 0) || 0), 0);

  return (
    <TableBody>
      {arrayRows.map((row, rowIndex) => {
        const rowData = value?.[row];
        const minusTotal = sum(rowData?.minus);

        return (
          <TableRow key={row} className="group [&>td]:text-xs">
            <TableCell className="pч-1 border-r">
              <span
                className={cn(
                  "text-rd",
                  minusTotal === 0 && "text-muted-foreground",
                )}
              >
                {minusTotal.toFixed(2)}
              </span>
            </TableCell>

            <TableCell className="bg-background pч-1 sticky left-0 text-start md:bg-transparent">
              <span
                className={cn(
                  "hover-cell truncate font-semibold text-green-600",
                )}
              >
                {row}
              </span>
            </TableCell>

            {monthDays.map((_, dayIndex) => (
              <TableCell key={dayIndex} className="border-x px-0 py-1.5">
                <input
                  {...register(
                    `rowSuppliers.${row}.minus.${dayIndex}` as const,
                  )}
                  data-row={rowIndex * 2}
                  data-col={dayIndex}
                  className={cn(
                    "h-9 w-full min-w-12 border-0 text-center text-xs",
                    "text-rd focus:bg-blue-50",
                  )}
                  onKeyDown={handleMultiTableNavigation}
                  disabled={disabled}
                  onFocus={() => setSelectedDay(dayIndex + 1)}
                />
              </TableCell>
            ))}
          </TableRow>
        );
      })}
    </TableBody>
  );
}
