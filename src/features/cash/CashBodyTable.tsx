"use client";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { FieldPath, UseFormReturn } from "react-hook-form";
import { CashFormType } from "./schema";
import { handleTableNavigation } from "@/utils/handleTableNavigation";
import { cn } from "@/lib/utils";
import { rows } from "./constants";
import React from "react";

export function CashBodyTable({
  form,
  monthDays,
  isDisabled,
  isClosed = false,
}: {
  form: UseFormReturn<CashFormType>;
  monthDays: { day: number; weekday: string }[];
  isDisabled?: boolean;
  isClosed?: boolean;
}) {
  const { register } = form;
  const value = form.watch("rowCashData");
  const totalCashBar = value?.cash
    ? Object.values(value.cash)
        .reduce((acc, val) => acc + +val, 0)
        .toFixed(2)
    : 0;
  const totalVisaBar = value?.visaBarByDay
    ? Object.values(value.visaBarByDay)
        .reduce((acc, val) => acc + +val, 0)
        .toFixed(2)
    : 0;
  const totalVisa = value?.visaTerminalByDay
    ? Object.values(value.visaTerminalByDay)
        .reduce((acc, val) => acc + +val, 0)
        .toFixed(2)
    : 0;
  const totalBank = value?.bankCollectionByDay
    ? Object.values(value.bankCollectionByDay)
        .reduce((acc, val) => acc + +val, 0)
        .toFixed(2)
    : 0;
  const totalNbmCollection = value?.nbmCollectionByDay
    ? Object.values(value.nbmCollectionByDay)
        .reduce((acc, val) => acc + +val, 0)
        .toFixed(2)
    : 0;
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
                if (
                  isClosed &&
                  (row.key === "tipsByDay" || row.key === "nbmPayByDay")
                )
                  return null;
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
                        row.colorText
                      )}
                      onKeyDown={(e) =>
                        handleTableNavigation(e, +index, dayIndex)
                      }
                    />
                  </TableCell>
                );
              })}
              <TableCell className="text-rd font-bold">
                {!isClosed && total}
              </TableCell>
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
      <TableRow>
        <TableCell className="h-10 border-0 text-bl">remaining cash</TableCell>
        <TableCell className="h-10 border-0 text-bl" colSpan={2}>
          {(totalCashBar - totalVisa - totalBank - totalNbmCollection).toFixed(
            2
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="h-10 border-0 text-bl">
          visa difference:
        </TableCell>
        <TableCell className="h-10 border-0 text-bl" colSpan={2}>
          {(totalVisaBar - totalVisa).toFixed(2)}
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
