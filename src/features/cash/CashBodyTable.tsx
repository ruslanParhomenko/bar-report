"use client";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { FieldPath, UseFormReturn } from "react-hook-form";
import { CashFormType } from "./schema";
import { handleTableNavigation } from "@/utils/handleTableNavigation";
import { cn } from "@/lib/utils";
import React from "react";
import { rows } from "./constants";
import { Input } from "@/components/ui/input";

export function CashBodyTable({
  form,
  monthDays,
  isDisabled,
}: {
  form: UseFormReturn<CashFormType>;
  monthDays: { day: number; weekday: string }[];
  isDisabled?: boolean;
}) {
  const { register } = form;
  const value = form.watch("rowCashData");
  return (
    <TableBody>
      <TableRow>
        <TableCell
          colSpan={monthDays.length + 2}
          className="h-10 border-0 text-bl"
        >
          CASH
        </TableCell>
      </TableRow>
      {rows.map((row, index) => {
        const total = (
          value[row.key as keyof CashFormType["rowCashData"]] as string[]
        )
          ?.reduce((acc: number, val: string) => acc + Number(val || 0), 0)
          .toFixed(2);
        return (
          <React.Fragment key={row.key}>
            <TableRow>
              <TableCell
                colSpan={2}
                className={cn(
                  "font-medium sticky left-0 p-0 text-start truncate",
                  row.colorText
                )}
              >
                {row.label}
              </TableCell>

              {monthDays.map((_, dayIndex) => {
                const fieldName =
                  `rowCashData.${row.key}.${dayIndex}` as FieldPath<CashFormType>;
                const value = form.watch(fieldName);
                return (
                  <TableCell
                    key={dayIndex}
                    className="p-0 text-center border-x"
                  >
                    <input
                      type="text"
                      disabled={isDisabled}
                      data-row={index}
                      data-col={dayIndex}
                      {...register(
                        `rowCashData.${row.key}.${dayIndex}` as FieldPath<CashFormType>
                      )}
                      className={cn(
                        "border-0  p-0 h-7 text-center  shadow-none text-xs w-12",
                        value ? row.colorText : ""
                      )}
                      onKeyDown={(e) =>
                        handleTableNavigation(e, +index, dayIndex)
                      }
                    />
                  </TableCell>
                );
              })}
              <TableCell className="text-rd font-bold">{total}</TableCell>
            </TableRow>
            {(row.key === "visaCasinoByDay" ||
              row.key === "visaCasinoBarByDay") && (
              <TableRow>
                <TableCell
                  colSpan={monthDays.length + 2}
                  className="h-10 border-0 text-bl"
                >
                  BAR
                </TableCell>
              </TableRow>
            )}
          </React.Fragment>
        );
      })}
    </TableBody>
  );
}
