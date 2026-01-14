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
  const start_241 = Number(form.watch("start_241") || 0);
  const z_531 = Number(form.watch("z_531") || 0);
  const ao_532 = Number(form.watch("ao_532") || 0);
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
                        "border-0  p-0 h-7 text-center  shadow-none text-xs w-11.5",
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
        <TableCell colSpan={monthDays.length}>
          <div className="flex gap-4 text-gn">
            <div>
              <span className=" font-bold">remaining cash:</span>
              <span className=" font-bold pl-4">
                {(
                  totalCashBar -
                  totalVisa -
                  totalBank -
                  totalNbmCollection
                ).toFixed(2)}
              </span>
            </div>
            <div>
              <span className=" font-bold">visa difference:</span>
              <span className=" font-bold pl-4">
                {(totalVisaBar - totalVisa).toFixed(2)}
              </span>
            </div>
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={monthDays.length}>
          <div className="flex gap-4 text-gn items-center">
            <div>
              <span className=" font-bold">start-241:</span>
              <input
                type="text"
                disabled={isDisabled}
                {...register(`start_241` as FieldPath<CashFormType>)}
                className={cn(
                  "border-0 bg-accent  p-0 ml-4 h-7 text-center  shadow-none text-xs w-24"
                )}
              />
            </div>
            <div>
              <span className=" font-bold">832:</span>
              <span className="bg-accent h-7 py-1.5 px-2 ml-4 text-xs">
                {totalNbmCollection ?? 0}
              </span>
            </div>
            <div>
              <span className=" font-bold">z-531:</span>
              <input
                type="text"
                disabled={isDisabled}
                {...register(`z_531` as FieldPath<CashFormType>)}
                className={cn(
                  "border-0 bg-accent  p-0 ml-4 h-7 text-center  shadow-none text-xs w-24"
                )}
              />
            </div>
            <div>
              <span className=" font-bold">ao-532:</span>
              <input
                type="text"
                disabled={isDisabled}
                {...register(`ao_532` as FieldPath<CashFormType>)}
                className={cn(
                  "border-0 bg-accent  p-0 ml-4 h-7 text-center  shadow-none text-xs w-24"
                )}
              />
            </div>
            <div>
              <span className=" font-bold">final_241:</span>
              <span className="bg-accent h-7 py-1.5 px-2 ml-4 text-xs">
                {(
                  start_241 +
                  Number(totalNbmCollection ?? 0) -
                  z_531 -
                  ao_532
                ).toFixed(2)}
              </span>
            </div>
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
