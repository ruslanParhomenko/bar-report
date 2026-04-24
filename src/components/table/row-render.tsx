"use client";

import {
  FieldPath,
  FieldValues,
  PathValue,
  UseFormReturn,
  useWatch,
} from "react-hook-form";

import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { MonthDayType } from "@/utils/get-month-days";
import { handleMultiTableNavigation } from "@/utils/handle-table-navigation";

export type ArrayRow = {
  key: string;
  label: string;
  colorText: string;
  type: "input" | "text";
};

type RowRenderProps<
  TForm extends FieldValues,
  TSection extends FieldPath<TForm>,
> = {
  nameField: TSection;
  nameLabel?: string;
  arrayRows: ArrayRow[];
  form: UseFormReturn<TForm>;
  monthDays: MonthDayType[];
  isDisabled?: boolean;
  withTotalFooter?: boolean;
};

export function RowRender<
  TForm extends FieldValues,
  TSection extends FieldPath<TForm>,
>({
  nameField,
  nameLabel,
  arrayRows,
  form,
  monthDays,
  isDisabled,
  withTotalFooter = true,
}: RowRenderProps<TForm, TSection>) {
  const { control, register } = form;

  const value = useWatch({
    control,
    name: nameField,
  }) as PathValue<TForm, TSection> | undefined;

  const totalByDay = monthDays.map((_, dayIndex) =>
    arrayRows.reduce((acc, row) => {
      const rowData = value?.[row.key] as unknown as string[] | undefined;
      if (!rowData) return acc;

      const num = Number(rowData[dayIndex]);
      return acc + (isNaN(num) ? 0 : num);
    }, 0),
  );

  return (
    <TableBody>
      {nameLabel && (
        <TableRow>
          <TableCell
            colSpan={monthDays.length + 2}
            className="h-10 border-0 text-xs"
          >
            {nameLabel}
          </TableCell>
        </TableRow>
      )}

      {arrayRows.map((row, rowIndex) => {
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
              colSpan={2}
              className={cn(
                "text-md bg-background sticky left-0 p-0 px-1 text-left font-medium",
                row.colorText,
              )}
            >
              {row.label}
            </TableCell>

            {monthDays.map((_, dayIndex) => (
              <TableCell key={dayIndex} className="border-x p-0 text-center">
                <input
                  type="text"
                  disabled={isDisabled}
                  data-row={rowIndex}
                  data-col={dayIndex}
                  {...register(
                    `${nameField}.${String(
                      row.key,
                    )}.${dayIndex}` as FieldPath<TForm>,
                  )}
                  className={cn(
                    "h-7 w-12 border-0 text-center text-xs",
                    row.colorText,
                  )}
                  onKeyDown={handleMultiTableNavigation}
                />
              </TableCell>
            ))}
          </TableRow>
        );
      })}

      {withTotalFooter && (
        <TableRow>
          <TableCell className="text-center text-xs font-bold text-black">
            {totalByDay.reduce((a, b) => a + b, 0).toFixed(2)}
          </TableCell>
          <TableCell colSpan={2} />
          {totalByDay.map((t, i) => (
            <TableCell key={i} className="text-center text-xs">
              {t > 0 ? t.toFixed(0) : ""}
            </TableCell>
          ))}
        </TableRow>
      )}
    </TableBody>
  );
}
