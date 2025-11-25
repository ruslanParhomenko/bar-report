import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";

export function CashFooterTable({
  monthDays,
  form,
}: {
  monthDays: { day: number; weekday: string }[];
  form: UseFormReturn<any>;
}) {
  const value = form.watch("rowCashData");
  let totalCashBar = 0;

  return (
    <TableFooter>
      <TableRow>
        <TableCell colSpan={monthDays.length + 4} className="h-8" />
      </TableRow>
      <TableRow>
        <TableCell colSpan={2}></TableCell>

        {monthDays.map((_day, dayIndex) => {
          const getNum = (val: any) => (isNaN(Number(val)) ? 0 : Number(val));

          const cashBarByDay = getNum(value?.["cashBarByDay"]?.[dayIndex]);
          const visaBarByDay = getNum(value?.["visaBarByDay"]?.[dayIndex]);
          const banquetBarByDay = getNum(
            value?.["banquetBarByDay"]?.[dayIndex]
          );
          const visaCasinoBarByDay = getNum(
            value?.["visaCasinoBarByDay"]?.[dayIndex]
          );

          const sumCashBarByDay =
            cashBarByDay + visaBarByDay + banquetBarByDay + visaCasinoBarByDay;

          const sumBarByDay = sumCashBarByDay.toFixed(0);

          const cashByDay = getNum(value?.["cash"]?.[dayIndex]);
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
        <TableCell>{totalCashBar.toFixed(2)}</TableCell>
      </TableRow>
    </TableFooter>
  );
}
