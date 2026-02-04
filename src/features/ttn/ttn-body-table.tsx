"use client";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { FieldPath, UseFormReturn, useWatch } from "react-hook-form";
import { SuppliersFormTypeInput } from "./schema";
import { handleTableNavigation } from "@/utils/handleTableNavigation";
import { cn } from "@/lib/utils";
import { useEffect, useEffectEvent, useState } from "react";

export default function TTNBodyTable({
  arrayRows,
  monthDays,
  form,
  isDisabled,
}: {
  arrayRows: string[];
  monthDays: ReturnType<typeof import("@/utils/getMonthDays").getMonthDays>;
  form: UseFormReturn<SuppliersFormTypeInput>;
  isDisabled?: boolean;
}) {
  const { register } = form;
  const value = useWatch({
    control: form.control,
    name: "rowSuppliers",
  });

  const currentDay = new Date().getDate();

  const [itemSearch, setItemSearch] = useState<string>("");
  const normalizedSearch = itemSearch.trim().toLowerCase();

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
      form.setValue(`rowSuppliers.${row}.final`, finalTotal);
    }
  });

  useEffect(() => {
    arrayRows.forEach((row) => updateFinal(row));
  }, [arrayRows, updateFinal]);
  return (
    <TableBody>
      <TableRow>
        <TableCell
          colSpan={monthDays.length + 3}
          className="text-xs p-0 pr-0.5  border-r"
        >
          <input
            type="text"
            placeholder="...search"
            onChange={(e) => setItemSearch(e.target.value)}
            className="p-1 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0"
          ></input>
        </TableCell>
      </TableRow>
      {arrayRows
        .filter((row) => row.includes(normalizedSearch))
        .map((row, rowIndex) => {
          const rowData = value?.[row];
          const minusTotal = sum(rowData?.minus);
          const plusTotal = sum(rowData?.plus);

          const isRowByCurrentDay = value?.[row]?.plus?.[currentDay - 1];

          const classNameInput =
            "h-4 w-full text-end text-xs border-0 p-0 m-0 box-border leading-none px-0.5";

          return (
            <TableRow key={row} className="group">
              <TableCell className="text-xs p-0 pr-0.5  border-r">
                <div className="w-30 grid grid-cols-2 gap-1">
                  <div className="flex flex-col  items-end">
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
                        `rowSuppliers.${row}.final` as FieldPath<SuppliersFormTypeInput>,
                      )}
                      className={cn(classNameInput, "text-gn hover-cell")}
                      disabled={isDisabled}
                    />
                  </div>
                </div>
              </TableCell>

              <TableCell className="text-start p-0 pl-1 sticky left-0 bg-background">
                <span
                  className={cn(
                    "truncate font-bold hover-cell",
                    isRowByCurrentDay && "text-rd",
                  )}
                >
                  {row}
                </span>
              </TableCell>
              <TableCell className="p-0 pr-0.5 border-l text-xs">
                <input
                  {...register(
                    `rowSuppliers.${row}.start` as FieldPath<SuppliersFormTypeInput>,
                  )}
                  className={cn(classNameInput, "hover-cell")}
                  disabled={isDisabled}
                />
              </TableCell>
              {monthDays.map((_, dayIndex) => (
                <TableCell key={dayIndex} className="p-0 border-x">
                  <div className="flex flex-col h-8">
                    <input
                      {...register(
                        `rowSuppliers.${row}.minus.${dayIndex}` as FieldPath<SuppliersFormTypeInput>,
                      )}
                      data-row={rowIndex * 2}
                      data-col={dayIndex}
                      className={cn(classNameInput, "text-rd")}
                      onKeyDown={(e) =>
                        handleTableNavigation(e, rowIndex * 2, dayIndex)
                      }
                      disabled={isDisabled}
                    />
                    <input
                      {...register(
                        `rowSuppliers.${row}.plus.${dayIndex}` as FieldPath<SuppliersFormTypeInput>,
                      )}
                      data-row={rowIndex * 2 + 1}
                      data-col={dayIndex}
                      className={cn(classNameInput, "text-bl")}
                      onKeyDown={(e) =>
                        handleTableNavigation(e, rowIndex * 2 + 1, dayIndex)
                      }
                      disabled={isDisabled}
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
