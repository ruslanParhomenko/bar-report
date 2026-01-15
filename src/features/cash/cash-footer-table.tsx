import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { CashFormTypeInput } from "./schema";
import { getMonthDays } from "@/utils/getMonthDays";

export function CashFooterTable({
  monthDays,
  form,
}: {
  monthDays: ReturnType<typeof getMonthDays>;
  form: UseFormReturn<CashFormTypeInput>;
}) {
  const value = form.watch("rowCashData");

  const totalCash = value?.cash
    ? Object.values(value.cash)
        .reduce((acc, val) => acc + Number(val || 0), 0)
        .toFixed(2)
    : 0;
  let totalCashBar = 0;

  return (
    <TableBody>
      <TableRow className="h-6" />
      <TableRow>
        <TableCell className="border-r">
          <div className="flex flex-col items-center gap-1 p-0">
            <div className="text-center text-xs p-0">
              {totalCashBar.toFixed(2)}
            </div>

            <div
              className={cn(
                "text-center text-xs text-muted-foreground",
                totalCashBar - Number(totalCash) < 0 ? "text-rd" : "text-gn"
              )}
            >
              {totalCashBar - Number(totalCash)}
            </div>
          </div>
        </TableCell>
        <TableCell colSpan={2} className="border-r" />

        {monthDays.map((_day, dayIndex) => {
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
      </TableRow>
    </TableBody>
  );
}
