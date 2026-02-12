import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { useFormContext, useWatch } from "react-hook-form";
import { SuppliersFormType } from "./schema";
import { useMemo } from "react";

export default function TTNFooterTable({
  arrayRows,
  monthDays,
}: {
  arrayRows: string[];
  monthDays: ReturnType<typeof import("@/utils/getMonthDays").getMonthDays>;
}) {
  const { control } = useFormContext<SuppliersFormType>();
  const value = useWatch({
    control: control,
    name: "rowSuppliers",
  });
  const sum = (arr?: Array<string | undefined>) =>
    (arr ?? []).reduce((acc, v) => acc + (Number(v ?? 0) || 0), 0);
  const totals = useMemo(() => {
    return arrayRows.reduce(
      (acc, row) => {
        const rowData = value?.[row];
        if (!rowData) return acc;

        const minus = sum(rowData.minus);
        const plus = sum(rowData.plus);
        const final = Number(rowData.final || 0);
        const start = Number(rowData.start || 0);

        acc.totalMinusSum += minus;
        acc.totalPlusSum += plus;
        acc.totalCreditStartSum += start < 0 ? start : 0;
        acc.totalDebitStartSum += start > 0 ? start : 0;
        acc.totalFinalSum += final;

        return acc;
      },
      {
        totalMinusSum: 0,
        totalPlusSum: 0,
        totalCreditStartSum: 0,
        totalDebitStartSum: 0,
        totalFinalSum: 0,
      },
    );
  }, [arrayRows, value]);

  return (
    <TableFooter>
      <TableRow className="sticky bottom-0 bg-background">
        <TableCell className="text-xs text-rd h-8 p-0">
          <div className="grid grid-cols-2 h-full gap-2">
            <div className="flex flex-col items-end">
              <span className="text-rd">{totals.totalMinusSum.toFixed(2)}</span>
              <span className="text-bl">{totals.totalPlusSum.toFixed(2)}</span>
            </div>
            <div>{totals.totalFinalSum.toFixed(2)}</div>
          </div>
        </TableCell>
        <TableCell />
        <TableCell className="text-xs text-rd  h-8 p-0">
          <div className="flex flex-col h-full items-end">
            <span className="text-rd">
              {totals.totalCreditStartSum.toFixed(2)}
            </span>
            <span className="text-bl">
              {totals.totalDebitStartSum.toFixed(2)}
            </span>
          </div>
        </TableCell>

        {monthDays.map((_, dayIndex) => {
          const dayTotalPlus = arrayRows.reduce((acc, row) => {
            const r = value?.[row];
            return acc + (Number(r?.plus?.[dayIndex]) || 0);
          }, 0);

          const dayTotalMinus = arrayRows.reduce((acc, row) => {
            const r = value?.[row];
            return acc + (Number(r?.minus?.[dayIndex]) || 0);
          }, 0);

          return (
            <TableCell key={dayIndex} className="text-end text-xs h-8 p-0">
              <div className="flex flex-col h-full">
                <span className="text-rd">
                  {dayTotalMinus ? (
                    dayTotalMinus.toFixed(2)
                  ) : (
                    <div className="h-1/2" />
                  )}
                </span>
                <span className="text-bl">
                  {dayTotalPlus ? (
                    dayTotalPlus.toFixed(2)
                  ) : (
                    <div className="h-1/2" />
                  )}
                </span>
              </div>
            </TableCell>
          );
        })}
      </TableRow>
    </TableFooter>
  );
}
