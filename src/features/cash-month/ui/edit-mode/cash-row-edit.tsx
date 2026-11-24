import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ROW_CASH_DATA } from "@/features/cash-month/model/constants";
import { CashForm } from "@/features/cash-month/model/schema";
import { CashSection } from "@/features/cash-month/ui/view-mode/cash-body-view";
import { useMonthDays } from "@/hooks/use-month-days";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/utils/format-number";
import { handleMultiTableNavigation } from "@/utils/handle-table-navigation";
import { useFormContext } from "react-hook-form";

const ROW_GROUP_BY_SECTIONS = Object.groupBy(ROW_CASH_DATA, (i) => i.section);

export default function CashRowEdit({
  rowsSection,
  rowCashData,
  selectedDay,
  withTotal = true,
  withTotalByDay = true,
  diffRowSection,
  register,
}: {
  rowsSection: CashSection;
  rowCashData: CashForm["rowCashData"];
  selectedDay?: number;
  withTotal?: boolean;
  withTotalByDay?: boolean;
  diffRowSection?: CashSection;
  register: ReturnType<typeof useFormContext>["register"];
}) {
  const { monthDays } = useMonthDays();
  const rowsBySection = ROW_GROUP_BY_SECTIONS?.[rowsSection];

  const diffRowBySection =
    diffRowSection && ROW_GROUP_BY_SECTIONS?.[diffRowSection];

  if (!rowsBySection) return null;

  const diffSectionTotal =
    diffRowBySection &&
    diffRowBySection?.reduce(
      (acc, row) =>
        acc +
        (rowCashData?.[row.key]?.reduce(
          (sum, val) => sum + Number(val || 0),
          0,
        ) ?? 0),
      0,
    );

  const sectionTotal =
    rowsBySection?.reduce(
      (acc, row) =>
        acc +
        (rowCashData?.[row.key]?.reduce(
          (sum, val) => sum + Number(val || 0),
          0,
        ) ?? 0),
      0,
    ) ?? 0;

  const diff = diffRowSection ? sectionTotal - (diffSectionTotal ?? 0) : null;

  return (
    <TableBody>
      {rowsBySection.map((row, rowIndex) => {
        const rowValues = rowCashData?.[row.key];

        const total = rowValues
          ?.reduce((acc, val) => acc + Number(val || 0), 0)
          .toFixed(2);

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
                  <input
                    type="text"
                    data-row={rowIndex}
                    data-col={dayIndex}
                    {...register(`rowCashData.${String(row.key)}.${dayIndex}`)}
                    className={cn(
                      "h-6 w-full border-0 text-center text-xs",
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

      <TableRow className="bg-border h-10 border-0 [&>td]:py-0.5 [&>td]:align-top">
        <TableCell className="text-bl pr-2 text-right text-xs font-bold">
          {withTotal && formatNumber(sectionTotal)}
          {diffRowSection && !withTotal && formatNumber(diff)}
        </TableCell>

        <TableCell className="bg-background sticky left-0 text-left font-bold md:bg-transparent" />

        {monthDays.map((_, dayIndex) => {
          const dayTotal = rowsBySection.reduce(
            (sum, row) => sum + Number(rowCashData?.[row.key]?.[dayIndex] || 0),
            0,
          );

          const dayTotalByDiffSection = diffRowBySection?.reduce(
            (sum, row) => sum + Number(rowCashData?.[row.key]?.[dayIndex] || 0),
            0,
          );

          const diffByDay = dayTotalByDiffSection
            ? dayTotal - dayTotalByDiffSection
            : "";
          const isSelected = selectedDay === dayIndex + 1;

          return (
            <TableCell
              key={dayIndex}
              className={cn(
                "text-bl w-12.5 px-0.5 text-center text-[11px]",
                diffRowSection && "text-rd",
                isSelected && "text-rd",
              )}
            >
              {withTotalByDay && formatNumber(dayTotal)}
              {diffRowSection && !withTotalByDay && formatNumber(diffByDay)}
            </TableCell>
          );
        })}
      </TableRow>
    </TableBody>
  );
}
