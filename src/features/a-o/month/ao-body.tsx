"use client";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useMonthDays } from "@/providers/month-days-provider";
import { handleMultiTableNavigation } from "@/utils/handle-table-navigation";
import { useFormContext, useWatch } from "react-hook-form";
import { rowsAdvance, rowsPurchaseModa, rowsPurchaseNMB } from "../constants";

type RowConfig =
  | (typeof rowsAdvance)[number]
  | (typeof rowsPurchaseModa)[number]
  | (typeof rowsPurchaseNMB)[number];

export default function AoBodyTable({
  data,
  selectedDay,
  isEdit,
  fieldName,
}: {
  data: readonly RowConfig[];
  selectedDay: number;
  isEdit: boolean;
  fieldName: string;
}) {
  const { control, register } = useFormContext();

  const value = useWatch({
    control: control,
    name: fieldName,
  });

  const { monthDays } = useMonthDays();

  const totalByDay = monthDays.map((_, dayIndex) =>
    data.reduce((acc, row) => {
      const rowData = value?.[row.key] as unknown as string[] | undefined;
      if (!rowData) return acc;

      const num = Number(rowData[dayIndex]);
      return acc + (isNaN(num) ? 0 : num);
    }, 0),
  );

  return (
    <TableBody>
      <TableRow className="h-6" />
      {data.map((row, rowIndex) => {
        const rowValues = value?.[row.key] as unknown as string[] | undefined;

        const total =
          row.type === "input"
            ? rowValues
                ?.reduce((acc, val) => acc + Number(val || 0), 0)
                .toFixed(2)
            : undefined;

        return (
          <TableRow key={String(row.key)} className="border-b!">
            <TableCell
              className={cn("border-r pr-2 text-right text-xs", row.colorText)}
            >
              {total}
            </TableCell>
            <TableCell
              className={cn(
                "text-md bg-background sticky left-0 p-0 px-2 text-left font-medium md:bg-transparent",
                row.colorText,
              )}
            >
              {row.label}
            </TableCell>

            {monthDays.map((_, dayIndex) => {
              const isSelected = dayIndex + 1 === selectedDay;
              return (
                <TableCell key={dayIndex} className="border-x p-0 text-center">
                  <input
                    type="text"
                    disabled={!isEdit}
                    data-row={rowIndex}
                    data-col={dayIndex}
                    {...register(
                      `${fieldName}.${String(row.key)}.${dayIndex}` as const,
                    )}
                    className={cn(
                      "h-7 w-16 border-0 px-0 text-center text-xs md:w-full",
                      row.colorText,
                      isSelected && "text-rd font-bold",
                    )}
                    onKeyDown={handleMultiTableNavigation}
                  />
                </TableCell>
              );
            })}
          </TableRow>
        );
      })}
      <TableRow>
        <TableCell className="text-center text-xs font-bold">
          {totalByDay.reduce((a, b) => a + b, 0).toFixed(2)}
        </TableCell>
        <TableCell />
        {totalByDay.map((t, i) => (
          <TableCell key={i} className="text-center text-xs">
            {t > 0 ? t.toFixed(0) : ""}
          </TableCell>
        ))}
      </TableRow>
    </TableBody>
  );
}
