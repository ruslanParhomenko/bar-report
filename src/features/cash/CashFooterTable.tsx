import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { CashFormType } from "./schema";

export function CashFooterTable({
  monthDays,
  form,
}: {
  monthDays: { day: number; weekday: string }[];
  form: UseFormReturn<CashFormType>;
}) {
  const value = form.watch("rowCashData");

  const totalCash = value?.cash
    ? Object.values(value.cash)
        .reduce((acc, val) => acc + +val, 0)
        .toFixed(2)
    : 0;
  let totalCashBar = 0;

  return (
    <TableFooter>
      <TableRow>
        <TableCell colSpan={monthDays.length + 4} className="h-8" />
      </TableRow>
      <TableRow>
        <TableCell colSpan={2}></TableCell>

        {monthDays.map((_day, dayIndex) => {
          const getNum = (val: string | undefined) =>
            isNaN(Number(val)) ? 0 : Number(val);

          const cashBarByDay = Array.isArray(value?.cashBarByDay)
            ? Number(value.cashBarByDay[dayIndex] ?? 0)
            : 0;

          const visaBarByDay = Array.isArray(value?.visaBarByDay)
            ? Number(value.visaBarByDay[dayIndex] ?? 0)
            : 0;
          const banquetBarByDay = Array.isArray(value?.banquetBarByDay)
            ? Number(value.banquetBarByDay[dayIndex] ?? 0)
            : 0;
          const visaCasinoBarByDay = Array.isArray(value?.visaCasinoBarByDay)
            ? Number(value.visaCasinoBarByDay[dayIndex] ?? 0)
            : 0;

          const cashByDay = Array.isArray(value?.cash)
            ? Number(value.cash[dayIndex] ?? 0)
            : 0;

          const sumCashBarByDay =
            cashBarByDay + visaBarByDay + banquetBarByDay + visaCasinoBarByDay;

          const sumBarByDay = sumCashBarByDay.toFixed(0);

          const difference = cashByDay - sumCashBarByDay;

          totalCashBar += sumCashBarByDay;

          return (
            <TableCell key={dayIndex} className="p-0">
              <div className="flex flex-col items-center gap-1 p-0">
                <div className="text-center text-xs p-0">{sumBarByDay}</div>

                <div
                  className={cn(
                    "text-center text-xs text-muted-foreground",
                    difference < 0 ? "text-rd" : "text-gn"
                  )}
                >
                  {difference === 0 ? "." : difference.toFixed(0)}
                </div>
              </div>
            </TableCell>
          );
        })}
        <TableCell>
          <div className="flex flex-col items-center gap-1 p-0">
            <div className="text-center text-xs p-0">
              {totalCashBar.toFixed(2)}
            </div>

            <div
              className={cn(
                "text-center text-xs text-muted-foreground",
                totalCashBar - totalCash < 0 ? "text-rd" : "text-gn"
              )}
            >
              {totalCashBar - totalCash}
            </div>
          </div>
        </TableCell>
      </TableRow>
    </TableFooter>
  );
}
