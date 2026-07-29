"use client";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useMonthDays } from "@/providers/month-days-provider";
import { handleMultiTableNavigation } from "@/utils/handle-table-navigation";
import { useFormContext, useWatch } from "react-hook-form";
import { TTNFormNBM } from "./schema";

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
            <TableCell className="w-18 border-r py-0 pr-1">
              <span
                className={cn(
                  "text-rd",
                  minusTotal === 0 && "text-muted-foreground",
                )}
              >
                {minusTotal.toFixed(2)}
              </span>
            </TableCell>

            <TableCell className="bg-background sticky left-0 w-28 py-0 pl-1 text-start md:bg-transparent">
              <span
                className={cn(
                  "hover-cell truncate font-semibold text-green-600",
                )}
              >
                {row}
              </span>
            </TableCell>

            {monthDays.map((_, dayIndex) => (
              <TableCell key={dayIndex} className="border-x p-0">
                <input
                  {...register(
                    `rowSuppliers.${row}.minus.${dayIndex}` as const,
                  )}
                  data-row={rowIndex * 2}
                  data-col={dayIndex}
                  className={cn(
                    "h-9 w-full border-0 px-0 text-center text-xs",
                    "text-rd",
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
