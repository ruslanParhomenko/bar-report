"use client";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useMonthDays } from "@/providers/month-days-provider";
import { handleMultiTableNavigation } from "@/utils/handle-table-navigation";
import { useFormContext, useWatch } from "react-hook-form";
import { ProductsFormNBM } from "./schema";

export default function BodyTable({
  arrayRows,
  disabled,
  setSelectedDay,
}: {
  arrayRows: string[];
  disabled?: boolean;
  setSelectedDay: (day: number) => void;
}) {
  const { register, control } = useFormContext<ProductsFormNBM>();

  const { monthDays } = useMonthDays();

  const value = useWatch({
    control: control,
    name: "rowProducts",
  });

  const sum = (arr?: Array<string | undefined>) =>
    (arr ?? []).reduce((acc, v) => acc + (Number(v ?? 0) || 0), 0);

  return (
    <TableBody>
      {arrayRows
        .sort((a, b) => a.localeCompare(b))
        .map((row, rowIndex) => {
          const total = sum(value?.[row]?.arrival);
          return (
            <TableRow key={row} className="group hover:text-rd! [&>td]:text-xs">
              <TableCell className="py-0 pr-1 text-center">
                <span
                  className={cn(
                    "group-hover:text-rd text-gn",
                    total === 0 && "text-gn/20",
                  )}
                >
                  {total.toFixed(0)}
                </span>
              </TableCell>

              <TableCell className="bg-background sticky left-0 py-0 pl-1 text-start md:bg-transparent">
                <span
                  className={cn(
                    "hover-cell text-bl group-hover:text-rd truncate",
                  )}
                >
                  {row.toLocaleLowerCase()}
                </span>
              </TableCell>
              <TableCell key={rowIndex} className="border-l p-0">
                <input
                  {...register(`rowProducts.${row}.remain` as const)}
                  data-row={rowIndex * 2}
                  data-col={monthDays.length + 1}
                  className={cn(
                    "text-bl h-[1.2rem]! w-full border-0 text-center text-xs font-bold md:px-0",
                  )}
                  onKeyDown={handleMultiTableNavigation}
                  disabled={disabled}
                  onFocus={() => setSelectedDay(monthDays.length + 1)}
                />
              </TableCell>

              {monthDays.map((_, dayIndex) => (
                <TableCell key={dayIndex} className="border-l p-0">
                  <input
                    {...register(
                      `rowProducts.${row}.arrival.${dayIndex}` as const,
                    )}
                    data-row={rowIndex * 2}
                    data-col={dayIndex}
                    className={cn(
                      "w-full border-0 text-center text-xs",
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
