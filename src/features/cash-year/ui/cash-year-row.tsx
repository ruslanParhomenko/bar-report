import { TableCell, TableRow } from "@/components/ui/table";
import { ROW_CASH_DATA } from "@/features/cash-month/model/constants";
import { GetCashData } from "@/features/cash-month/model/type";
import { CashSection } from "@/features/cash-month/ui/view-mode/cash-body-view";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/utils/format-number";
import { MONTHS } from "@/utils/get-month-days";

const ROW_GROUP_BY_SECTIONS = Object.groupBy(ROW_CASH_DATA, (i) => i.section);

function sumArray(arr: (string | undefined)[] = []) {
  return arr.reduce((acc, v) => acc + (Number(v) || 0), 0);
}
export default function CashYearRow({
  rowsSection,
  data,
  withTotal = true,
  withTotalByDay = true,
}: {
  rowsSection: CashSection;
  data: GetCashData[];
  withTotal?: boolean;
  withTotalByDay?: boolean;
}) {
  const monthMap = Object.fromEntries(
    (data ?? []).map((d) => [d.id, d.cashData]),
  );

  const getMonthRowTotal = (month: string, key: string) => {
    const arr =
      monthMap[month]?.rowCashData?.[
        key as keyof (typeof monthMap)[string]["rowCashData"]
      ];
    return sumArray(arr as string[]);
  };

  const getYearRowTotal = (key: string) =>
    MONTHS.reduce((acc, month) => acc + getMonthRowTotal(month, key), 0);

  const rowsBySection = ROW_GROUP_BY_SECTIONS?.[rowsSection];

  if (!rowsBySection) return null;

  const monthTotals = MONTHS.map((month) =>
    rowsBySection.reduce(
      (acc, row) => acc + getMonthRowTotal(month, row.key),
      0,
    ),
  );
  const sectionTotal = monthTotals.reduce((a, b) => a + b, 0);

  return (
    <>
      {rowsBySection.map((row) => {
        const rowValues = getYearRowTotal(row.key);

        return (
          <TableRow
            key={row.key}
            className="[&>td]:text-gr/60 h-8 border-y [&>td]:py-0 [&>td]:text-xs"
          >
            <TableCell className={cn("border-r pr-2 text-right text-xs")}>
              {rowValues}
            </TableCell>
            <TableCell
              className={cn(
                "bg-background sticky left-0 text-left text-xs font-medium md:bg-transparent",
              )}
            >
              {row.label}
            </TableCell>

            {MONTHS.map((month) => {
              const valueByMonth = getMonthRowTotal(month, row.key);

              return (
                <TableCell
                  key={month}
                  className="w-32 border-x text-center text-xs"
                >
                  {formatNumber(valueByMonth)}
                </TableCell>
              );
            })}
          </TableRow>
        );
      })}

      <TableRow className="h-12 border-0 [&>td]:py-0.5 [&>td]:align-top">
        <TableCell className="pr-2 text-right font-bold">
          {withTotal && formatNumber(sectionTotal)}
        </TableCell>

        <TableCell className="bg-background sticky left-0 text-left font-bold md:bg-transparent" />

        {MONTHS.map((month, i) => (
          <TableCell
            key={month}
            className="border-0 px-0.5 text-center font-bold"
          >
            {withTotalByDay && formatNumber(monthTotals[i])}
          </TableCell>
        ))}
      </TableRow>
    </>
  );
}
