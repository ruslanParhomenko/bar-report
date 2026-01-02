"use client";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { FieldPath, UseFormReturn } from "react-hook-form";
import { handleTableNavigation } from "@/utils/handleTableNavigation";
import { cn } from "@/lib/utils";
import { AOFormType } from "./schema";
import { rowsAdvance, rowsPurchaseModa, rowsPurchaseNMB } from "./constants";
import { handleMultiTableNavigation } from "@/utils/handleMultiTableNavigation";

export function AOBodyTable({
  form,
  monthDays,
  isDisabled,
  isClosed = false,
}: {
  form: UseFormReturn<AOFormType>;
  monthDays: { day: number; weekday: string }[];
  isDisabled?: boolean;
  isClosed?: boolean;
}) {
  const { register } = form;
  const value = form.watch("rowAOData");
  // +
  const totalAdvanceModa = value?.advanceModaByDay
    ? Object.values(value.advanceModaByDay)
        .reduce((acc, val) => acc + +val, 0)
        .toFixed(2)
    : 0;
  const totalAdvanceNBM = value?.advanceNBMByDay
    ? Object.values(value.advanceNBMByDay)
        .reduce((acc, val) => acc + +val, 0)
        .toFixed(2)
    : 0;

  // -
  const totalPurchaseModa = value?.purchaseModaByDay
    ? Object.values(value.purchaseModaByDay)
        .reduce((acc, val) => acc + +val, 0)
        .toFixed(2)
    : 0;
  const totalTTNModa = value?.ttnModaByDay
    ? Object.values(value.ttnModaByDay)
        .reduce((acc, val) => acc + +val, 0)
        .toFixed(2)
    : 0;
  const totalPurchaseBar = value?.purchaseBarByDay
    ? Object.values(value.purchaseBarByDay)
        .reduce((acc, val) => acc + +val, 0)
        .toFixed(2)
    : 0;
  const totalTTNBar = value?.ttnBarByDay
    ? Object.values(value.ttnBarByDay)
        .reduce((acc, val) => acc + +val, 0)
        .toFixed(2)
    : 0;

  const totalFuelNBM = value?.fuelNBMByDay
    ? Object.values(value.fuelNBMByDay)
        .reduce((acc, val) => acc + +val, 0)
        .toFixed(2)
    : 0;
  const totalPurchaseNBM = value?.purchaseNBMByDay
    ? Object.values(value.purchaseNBMByDay)
        .reduce((acc, val) => acc + +val, 0)
        .toFixed(2)
    : 0;
  const totalTTNNBM = value?.ttnNBMByDay
    ? Object.values(value.ttnNBMByDay)
        .reduce((acc, val) => acc + +val, 0)
        .toFixed(2)
    : 0;

  let globalRowIndex = 0;
  return (
    <TableBody>
      <TableRow>
        <TableCell
          colSpan={monthDays.length + 2}
          className="h-12 border-0 text-bl"
        >
          +
        </TableCell>
      </TableRow>
      {rowsAdvance.map((row, _index) => {
        const currentRow = globalRowIndex++;
        const total = (
          value?.[row.key as keyof AOFormType["rowAOData"]] as string[]
        )
          ?.reduce((acc: number, val: string) => acc + Number(val || 0), 0)
          .toFixed(2);
        return (
          <TableRow key={row.key}>
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
              return (
                <TableCell key={dayIndex} className="p-0 text-center border-x">
                  <input
                    type="text"
                    disabled={isDisabled}
                    data-row={currentRow}
                    data-col={dayIndex}
                    {...register(
                      `rowAOData.${row.key}.${dayIndex}` as FieldPath<AOFormType>
                    )}
                    className={cn(
                      "border-0  p-0 h-7 text-center  shadow-none text-xs w-12",
                      row.colorText
                    )}
                    onKeyDown={(e) =>
                      handleMultiTableNavigation(e, currentRow, dayIndex)
                    }
                  />
                </TableCell>
              );
            })}
            <TableCell className="text-rd font-bold">
              {!isClosed && total}
            </TableCell>
          </TableRow>
        );
      })}
      <TableRow>
        <TableCell
          colSpan={monthDays.length + 2}
          className="h-12 border-0 text-black text-xs"
        >
          - moda
        </TableCell>
      </TableRow>
      {rowsPurchaseModa.map((row, index) => {
        const currentRow = globalRowIndex++;
        const total = (
          value?.[row.key as keyof AOFormType["rowAOData"]] as string[]
        )
          ?.reduce((acc: number, val: string) => acc + Number(val || 0), 0)
          .toFixed(2);
        return (
          <TableRow key={row.key}>
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
              return (
                <TableCell key={dayIndex} className="p-0 text-center border-x">
                  {"data" in row && row.data ? (
                    <select
                      disabled={isDisabled}
                      data-row={currentRow}
                      data-col={dayIndex}
                      {...register(
                        `rowAOData.${row.key}.${dayIndex}` as FieldPath<AOFormType>
                      )}
                      className={cn(
                        "border-0 p-0 h-7 w-12 text-center text-xs shadow-none",
                        "appearance-none bg-transparent",
                        "focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
                        "hover:bg-transparent active:bg-transparent",
                        "[&_svg]:hidden",
                        row.colorText
                      )}
                    >
                      <option value="">--</option>
                      {(row.data as unknown as string[])?.map(
                        (option: string) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        )
                      )}
                    </select>
                  ) : (
                    <input
                      type="text"
                      disabled={isDisabled}
                      data-row={currentRow}
                      data-col={dayIndex}
                      {...register(
                        `rowAOData.${row.key}.${dayIndex}` as FieldPath<AOFormType>
                      )}
                      className={cn(
                        "border-0  p-0 h-7 text-center  shadow-none text-xs w-12",
                        row.colorText
                      )}
                      onKeyDown={(e) =>
                        handleMultiTableNavigation(e, currentRow, dayIndex)
                      }
                    />
                  )}
                </TableCell>
              );
            })}
            <TableCell className="text-rd font-bold">
              {!isClosed && !("data" in row && row.data) && total}
            </TableCell>
          </TableRow>
        );
      })}
      <TableRow>
        <TableCell
          colSpan={monthDays.length + 2}
          className="h-12 border-0 text-gn text-xs"
        >
          - nbm
        </TableCell>
      </TableRow>
      {rowsPurchaseNMB.map((row, _index) => {
        const currentRow = globalRowIndex++;
        const total = (
          value?.[row.key as keyof AOFormType["rowAOData"]] as string[]
        )
          ?.reduce((acc: number, val: string) => acc + Number(val || 0), 0)
          .toFixed(2);
        return (
          <TableRow key={row.key}>
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
              return (
                <TableCell key={dayIndex} className="p-0 text-center border-x">
                  {"data" in row && row.data ? (
                    <select
                      disabled={isDisabled}
                      data-row={currentRow}
                      data-col={dayIndex}
                      {...register(
                        `rowAOData.${row.key}.${dayIndex}` as FieldPath<AOFormType>
                      )}
                      className={cn(
                        "border-0  p-0 h-7 text-center  shadow-none text-xs w-12",
                        row.colorText
                      )}
                    >
                      <option value="">--</option>
                      {(row.data as string[])?.map((option: string) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      disabled={isDisabled}
                      data-row={currentRow}
                      data-col={dayIndex}
                      {...register(
                        `rowAOData.${row.key}.${dayIndex}` as FieldPath<AOFormType>
                      )}
                      className={cn(
                        "border-0  p-0 h-7 text-center  shadow-none text-xs w-12",
                        row.colorText
                      )}
                      onKeyDown={(e) =>
                        handleMultiTableNavigation(e, currentRow, dayIndex)
                      }
                    />
                  )}
                </TableCell>
              );
            })}
            <TableCell className="text-rd font-bold">
              {!isClosed && total}
            </TableCell>
          </TableRow>
        );
      })}
      {/* <TableRow>
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
      </TableRow> */}
    </TableBody>
  );
}
