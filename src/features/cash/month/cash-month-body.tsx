import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useFormContext, useWatch } from "react-hook-form";

import { cn } from "@/lib/utils";

import { useMonthDays } from "@/providers/month-days-provider";
import { handleMultiTableNavigation } from "@/utils/handle-table-navigation";

export function CashMonthBodyTable({
  data,
  selectedDay,
  isEdit,
}: {
  data: {
    key: string;
    label: string;
    colorText: string;
  }[];
  selectedDay: number;
  isEdit: boolean;
}) {
  const { control, register } = useFormContext();

  const value = useWatch({
    control: control,
    name: "rowCashData",
  });

  const { monthDays } = useMonthDays();

  return (
    <TableBody>
      <TableRow className="h-6" />
      {data.map((row, rowIndex) => {
        const rowValues = value?.[row.key] as unknown as string[] | undefined;

        const total = rowValues
          ?.reduce((acc, val) => acc + Number(val || 0), 0)
          .toFixed(2);

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
                    {...register(`rowCashData.${String(row.key)}.${dayIndex}`)}
                    className={cn(
                      "h-7 w-full border-0 text-center text-xs",
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
    </TableBody>
  );
}
