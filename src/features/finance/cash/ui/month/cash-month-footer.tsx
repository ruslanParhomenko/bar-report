import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useMonthDays } from "@/hooks/use-month-days";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { CashForm } from "../../model/schema";

export function CashMonthFooterTable() {
  const { monthDays } = useMonthDays();
  const { watch } = useFormContext<CashForm>();
  const value = watch("rowCashData");

  const totalCash = value?.cash
    ? Object.values(value.cash)
        .reduce((acc, val) => acc + Number(val || 0), 0)
        .toFixed(2)
    : 0;

  const totalCashBuffet = value?.cashBuffet
    ? Object.values(value.cashBuffet)
        .reduce((acc, val) => acc + Number(val || 0), 0)
        .toFixed(2)
    : 0;

  const total = Number(totalCash) + Number(totalCashBuffet);

  const totalCashBar = value?.cashBarByDay
    ? Object.values(value.cashBarByDay)
        .reduce((acc, val) => acc + Number(val || 0), 0)
        .toFixed(2)
    : 0;
  const totalCashBarBuffet = value?.cashBarByDayBuffet
    ? Object.values(value.cashBarByDayBuffet)
        .reduce((acc, val) => acc + Number(val || 0), 0)
        .toFixed(2)
    : 0;
  const totalVisaBar = value?.visaBarByDay
    ? Object.values(value.visaBarByDay)
        .reduce((acc, val) => acc + Number(val || 0), 0)
        .toFixed(2)
    : 0;
  const totalVisaBarBuffet = value?.visaBarByDayBuffet
    ? Object.values(value.visaBarByDayBuffet)
        .reduce((acc, val) => acc + Number(val || 0), 0)
        .toFixed(2)
    : 0;
  const difference =
    Number(totalCashBar) +
    Number(totalCashBarBuffet) +
    Number(totalVisaBar) +
    Number(totalVisaBarBuffet) -
    Number(total);
  const isNegative = difference < 0;
  return (
    <TableBody>
      <TableRow className="h-6" />
      <TableRow>
        <TableCell className="border-r">
          <div className="flex flex-col items-center gap-1 p-0">
            <div className="p-0 text-center text-xs">{Number(total)}</div>

            <div
              className={cn(
                "text-muted-foreground text-center text-xs",
                isNegative ? "text-rd" : "text-gn",
              )}
            >
              {difference.toFixed(2)}
            </div>
          </div>
        </TableCell>
        <TableCell className="border-r" />

        {monthDays.map((_day, dayIndex) => {
          const cashBarByDay = Array.isArray(value?.cashBarByDay)
            ? Number(value.cashBarByDay[dayIndex] ?? 0)
            : 0;

          const cashBarBuffetByDay = Array.isArray(value?.cashBarByDayBuffet)
            ? Number(value.cashBarByDayBuffet[dayIndex] ?? 0)
            : 0;

          const visaBarByDay = Array.isArray(value?.visaBarByDay)
            ? Number(value.visaBarByDay[dayIndex] ?? 0)
            : 0;

          const visaBarBuffetByDay = Array.isArray(value?.visaBarByDayBuffet)
            ? Number(value.visaBarByDayBuffet[dayIndex] ?? 0)
            : 0;

          const cashByDay = Array.isArray(value?.cash)
            ? Number(value.cash[dayIndex] ?? 0)
            : 0;

          const cashBuffetByDay = Array.isArray(value?.cashBuffet)
            ? Number(value.cashBuffet[dayIndex] ?? 0)
            : 0;

          const totalCashFiscal = cashByDay + cashBuffetByDay;

          const totalCash1c = Number(
            (
              cashBarByDay +
              visaBarByDay +
              cashBarBuffetByDay +
              visaBarBuffetByDay
            ).toFixed(0),
          );

          const difference = totalCashFiscal - totalCash1c;

          return (
            <TableCell key={dayIndex} className="p-0">
              <div className="flex flex-col items-center gap-1 p-0">
                <div className="p-0 text-center text-xs">{totalCashFiscal}</div>

                <div
                  className={cn(
                    "text-muted-foreground text-center text-xs",
                    difference < 0 ? "text-rd" : "text-gn",
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
