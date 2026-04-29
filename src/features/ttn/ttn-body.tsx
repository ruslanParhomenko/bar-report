"use client";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useMonthDays } from "@/providers/month-days-provider";
import { handleMultiTableNavigation } from "@/utils/handle-table-navigation";
import { useEffect, useEffectEvent } from "react";
import { FieldPath, useFormContext, useWatch } from "react-hook-form";
import { SuppliersFormType } from "./schema";

export default function TtnBodyTable({
  arrayRows,
  disabled,
  normalizedSearch,
}: {
  arrayRows: string[];
  disabled?: boolean;
  normalizedSearch: string;
}) {
  const { register, control, setValue } = useFormContext<SuppliersFormType>();

  const { monthDays } = useMonthDays();

  const value = useWatch({
    control: control,
    name: "rowSuppliers",
  });

  const currentDay = new Date().getDate();

  const sum = (arr?: Array<string | undefined>) =>
    (arr ?? []).reduce((acc, v) => acc + (Number(v ?? 0) || 0), 0);

  const updateFinal = useEffectEvent((row: string) => {
    const rowData = value?.[row];
    if (!rowData) return;

    const minusTotal = sum(rowData.minus);
    const plusTotal = sum(rowData.plus);
    const startAmount = Number(rowData.start || 0);
    const finalTotal = (startAmount + minusTotal + plusTotal).toFixed(2);

    const currentFinal = rowData.final ?? "0";
    if (currentFinal !== finalTotal) {
      setValue(`rowSuppliers.${row}.final`, finalTotal);
    }
  });

  useEffect(() => {
    arrayRows.forEach((row) => updateFinal(row));
  }, [arrayRows, updateFinal]);
  return (
    <TableBody>
      {arrayRows
        .filter((row) => row.includes(normalizedSearch))
        .map((row, rowIndex) => {
          const rowData = value?.[row];
          const minusTotal = sum(rowData?.minus);
          const plusTotal = sum(rowData?.plus);

          const isRowByCurrentDay = value?.[row]?.plus?.[currentDay - 1];

          const classNameInput = "h-4 w-full text-end text-xs border-0 px-1";

          return (
            <TableRow key={row} className="group [&>td]:text-xs">
              <TableCell className="border-r p-0">
                <div className="grid w-full grid-cols-2 gap-0.5">
                  <div className="flex flex-col items-end">
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
                  <div className="flex items-center">
                    <input
                      {...register(
                        `rowSuppliers.${row}.final` as FieldPath<SuppliersFormType>,
                      )}
                      className={cn(classNameInput, "text-gn hover-cell")}
                      disabled={disabled}
                    />
                  </div>
                </div>
              </TableCell>

              <TableCell className="bg-background sticky left-0 p-0 pl-1 text-start md:bg-transparent">
                <span
                  className={cn(
                    "hover-cell truncate font-semibold text-green-600",
                    isRowByCurrentDay && "text-rd",
                  )}
                >
                  {row}
                </span>
              </TableCell>
              <TableCell className="border-l p-0 pr-0.5">
                <input
                  {...register(
                    `rowSuppliers.${row}.start` as FieldPath<SuppliersFormType>,
                  )}
                  className={cn(classNameInput, "hover-cell")}
                  disabled={disabled}
                />
              </TableCell>
              {monthDays.map((_, dayIndex) => (
                <TableCell key={dayIndex} className="border-x p-0">
                  <div className="flex h-8 flex-col">
                    <input
                      {...register(
                        `rowSuppliers.${row}.minus.${dayIndex}` as FieldPath<SuppliersFormType>,
                      )}
                      data-row={rowIndex * 2}
                      data-col={dayIndex}
                      className={cn(classNameInput, "text-rd")}
                      onKeyDown={handleMultiTableNavigation}
                      disabled={disabled}
                    />
                    <input
                      {...register(
                        `rowSuppliers.${row}.plus.${dayIndex}` as FieldPath<SuppliersFormType>,
                      )}
                      data-row={rowIndex * 2 + 1}
                      data-col={dayIndex}
                      className={cn(classNameInput, "text-bl")}
                      onKeyDown={handleMultiTableNavigation}
                      disabled={disabled}
                    />
                  </div>
                </TableCell>
              ))}
            </TableRow>
          );
        })}
    </TableBody>
  );
}
