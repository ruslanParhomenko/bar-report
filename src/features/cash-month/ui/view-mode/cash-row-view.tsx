import { TableCell, TableRow } from "@/components/ui/table";
import { CashSection } from "@/features/cash-month/ui/view-mode/cash-body-view";
import { ROW_CASH_DATA } from "@/features/finance/cash/model/constants";
import { GetCashData } from "@/features/finance/cash/model/type";
import { useMonthDays } from "@/hooks/use-month-days";
import { cn } from "@/lib/utils";

export default function CashRowView({
  rowsSection,
  dataCash,
  selectedDay,
  withTotal = true,
  withTotalByDay = true,
  diffRowSection,
}: {
  rowsSection: CashSection;
  dataCash: GetCashData["cashData"] | undefined;
  selectedDay?: number;
  withTotal?: boolean;
  withTotalByDay?: boolean;
  diffRowSection?: CashSection;
}) {
  const { monthDays } = useMonthDays();

  const rowsBySection =
    Object.groupBy(ROW_CASH_DATA, (item) => item.section)?.[rowsSection] || [];

  const diffRowBySection =
    diffRowSection &&
    Object.groupBy(ROW_CASH_DATA, (item) => item.section)?.[diffRowSection];

  const diffSectionTotal =
    diffRowBySection &&
    diffRowBySection?.reduce(
      (acc, row) =>
        acc +
        (dataCash?.rowCashData?.[row.key]?.reduce(
          (sum, val) => sum + Number(val || 0),
          0,
        ) ?? 0),
      0,
    );

  console.log("diffSectionTotal", diffSectionTotal);

  const sectionTotal =
    rowsBySection?.reduce(
      (acc, row) =>
        acc +
        (dataCash?.rowCashData?.[row.key]?.reduce(
          (sum, val) => sum + Number(val || 0),
          0,
        ) ?? 0),
      0,
    ) ?? 0;

  const diff = diffRowSection ? sectionTotal - (diffSectionTotal ?? 0) : null;

  console.log("rowsBySection", diff);

  if (!rowsBySection) {
    return null;
  }

  return (
    <>
      {rowsBySection.map((row: any) => {
        const rowValues = dataCash?.rowCashData?.[row.key];

        const total = (
          rowValues?.reduce((acc, val) => acc + Number(val || 0), 0) ?? 0
        ).toFixed(2);

        return (
          <TableRow
            key={row.key}
            className="h-7 border-y [&>td]:py-0 [&>td]:text-xs"
          >
            <TableCell
              className={cn("border-r pr-2 text-right text-xs", row.colorText)}
            >
              {total}
            </TableCell>
            <TableCell
              className={cn(
                "bg-background sticky left-0 text-left text-xs font-medium md:bg-transparent",
                row.colorText,
              )}
            >
              {row.label}
            </TableCell>

            {monthDays.map((_, dayIndex) => {
              const isSelected = selectedDay === dayIndex + 1;

              return (
                <TableCell
                  key={dayIndex}
                  className={cn(
                    "border-x text-center text-xs",
                    row.colorText,
                    isSelected && "text-rd font-bold",
                  )}
                >
                  {rowValues?.[dayIndex] === "0" ? "" : rowValues?.[dayIndex]}
                </TableCell>
              );
            })}
          </TableRow>
        );
      })}

      <TableRow className="h-8 border-0 [&>td]:py-0 [&>td]:text-xs">
        <TableCell className="text-bl pr-2 text-right text-xs">
          {withTotal && sectionTotal.toFixed(2)}
          {diffRowSection &&
            !withTotal &&
            diff !== null &&
            diff !== 0 &&
            diff.toFixed(2)}
        </TableCell>

        <TableCell className="bg-background sticky left-0 text-left font-bold md:bg-transparent"></TableCell>

        {monthDays.map((_, dayIndex) => {
          const dayTotal = rowsBySection.reduce(
            (sum, row) =>
              sum + Number(dataCash?.rowCashData?.[row.key]?.[dayIndex] || 0),
            0,
          );

          const dayTotalByDiffSection = diffRowBySection?.reduce(
            (sum, row) =>
              sum + Number(dataCash?.rowCashData?.[row.key]?.[dayIndex] || 0),
            0,
          );

          const diffByDay = dayTotalByDiffSection
            ? dayTotal - dayTotalByDiffSection
            : "";

          console.log("diffByDay", diffByDay);

          const isSelected = selectedDay === dayIndex + 1;

          return (
            <TableCell
              key={dayIndex}
              className={cn(
                "text-center",
                rowsBySection[0]?.colorText,
                diffRowSection && "text-rd",
                isSelected && "text-rd",
              )}
            >
              {withTotalByDay && (dayTotal === 0 ? "" : dayTotal)}
              {diffRowSection &&
                !withTotalByDay &&
                diffByDay !== 0 &&
                diffByDay !== 0.0 &&
                Number(diffByDay).toFixed(2) !== "0.00" &&
                Number(diffByDay).toFixed(2)}
            </TableCell>
          );
        })}
      </TableRow>

      <TableRow className="h-3 border-0" />
    </>
  );
}
