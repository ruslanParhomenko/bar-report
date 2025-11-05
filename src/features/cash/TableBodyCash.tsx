import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { FieldPath, UseFormReturn, useWatch } from "react-hook-form";
import { CashFormType } from "./schema";
import { handleTableNavigation } from "@/utils/handleTableNavigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import React from "react";

export default function TableBodyCash({
  form,
  monthDays,
  isDisabled,
}: {
  form: UseFormReturn<CashFormType>;
  monthDays: { day: number; weekday: string }[];
  isDisabled?: boolean;
}) {
  const t = useTranslations("Home");
  const { register } = form;

  const rows = [
    {
      key: "tipsByDay",
      label: "tips",
      colorBg: " bg-bl",
      colorText: " text-bl",
    },
    {
      key: "chipsByDay",
      label: "bayChips",
      colorBg: " bg-gr",
      colorText: " text-black",
    },
    {
      key: "differenceByDay",
      label: "difference",
      colorBg: " bg-gr",
      colorText: " text-gr",
    },
    {
      key: "visaCasinoByDay",
      label: "visaCasino",
      colorBg: " bg-gr",
      colorText: " text-black",
    },
  ] as const;

  return (
    <TableBody>
      {rows.map((row, index) => (
        <React.Fragment key={row.key}>
          <TableRow>
            <TableCell
              colSpan={2}
              className={cn("font-bold", row.colorText, "text-center")}
            >
              {t(row.label)}
            </TableCell>

            {monthDays.map((_, dayIndex) => {
              const fieldName =
                `rowCashData.${row.key}.${dayIndex}` as FieldPath<CashFormType>;
              const value = form.watch(fieldName);
              return (
                <TableCell key={dayIndex} className="p-1 text-center border-x">
                  <input
                    type="text"
                    disabled={isDisabled}
                    data-row={index}
                    data-col={dayIndex}
                    {...register(
                      `rowCashData.${row.key}.${dayIndex}` as FieldPath<CashFormType>
                    )}
                    className={cn(
                      "w-full border-0 rounded-[4px] p-1 text-center font-bold",
                      value ? row.colorText : row.colorBg
                    )}
                    onKeyDown={(e) =>
                      handleTableNavigation(e, +index, dayIndex)
                    }
                  />
                </TableCell>
              );
            })}
          </TableRow>
          {(row.key === "tipsByDay" || row.key === "differenceByDay") && (
            <TableRow>
              <TableCell
                colSpan={monthDays.length + 2}
                className="h-8 border-0"
              ></TableCell>
            </TableRow>
          )}
        </React.Fragment>
      ))}
    </TableBody>
  );
}
