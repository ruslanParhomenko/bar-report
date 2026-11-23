import { TableBody } from "@/components/ui/table";
import CashRowView from "@/features/cash-month/ui/view-mode/cash-row-view";
import type { GetCashData } from "@/features/finance/cash/model/type";
import { useMonthDays } from "@/hooks/use-month-days";

export type CashSection =
  "1c" | "cash" | "visa" | "visa-terminal" | "nbm" | "coll";
export type CashItem = {
  key: string;
  label: string;
  colorText: string;
  section: CashSection;
};

export function CashMonthBodyView({
  dataCashByMonth,
  data,
  selectedDay,
}: {
  dataCashByMonth: GetCashData | null;
  data: CashItem[];
  selectedDay?: number;
}) {
  const { monthDays } = useMonthDays();

  const dataCash = dataCashByMonth?.cashData;

  return (
    <TableBody>
      <CashRowView
        rowsSection={"1c"}
        dataCash={dataCash}
        selectedDay={selectedDay}
        diffRowSection={"cash"}
        withTotalByDay={false}
        withTotal={false}
      />
      <CashRowView
        rowsSection={"cash"}
        dataCash={dataCash}
        selectedDay={selectedDay}
      />
      <CashRowView
        rowsSection={"visa"}
        dataCash={dataCash}
        selectedDay={selectedDay}
      />
      <CashRowView
        rowsSection={"visa-terminal"}
        dataCash={dataCash}
        selectedDay={selectedDay}
        diffRowSection={"visa"}
        withTotalByDay={false}
        withTotal={false}
      />
      <CashRowView
        rowsSection={"coll"}
        dataCash={dataCash}
        selectedDay={selectedDay}

        withTotalByDay={false}
      />
      <CashRowView
        rowsSection={"nbm"}
        dataCash={dataCash}
        selectedDay={selectedDay}
        withTotal={false}
        withTotalByDay={false}
      />

      {/* {Object.entries(dataBySections).map(([section, rows]) => {
        const sectionTotal = rows.reduce(
          (acc, row) =>
            acc +
            (!NOT_INCLUDE_IN_TOTAL.includes(row.key) &&
            dataCash?.rowCashData?.[row.key]
              ? dataCash?.rowCashData?.[row.key]?.reduce(
                  (sum, val) => sum + Number(val || 0),
                  0,
                )
              : 0),
          0,
        );

        return (
          <Fragment key={section}>
            {rows.map((row) => {
              const rowValues = dataCash?.rowCashData?.[row.key];

              const total = rowValues
                ?.reduce((acc, val) => acc + Number(val || 0), 0)
                .toFixed(2);

              return (
                <TableRow
                  key={row.key}
                  className="h-7 border-y [&>td]:py-0 [&>td]:text-xs"
                >
                  <TableCell
                    className={cn(
                      "border-r pr-2 text-right text-xs",
                      row.colorText,
                    )}
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
                        {rowValues?.[dayIndex]}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}

            <TableRow className="h-6 border-0 [&>td]:py-0 [&>td]:text-[11px]">
              <TableCell className="pr-2 text-right text-xs">
                {sectionTotal.toFixed(2)}
              </TableCell>

              <TableCell className="bg-background sticky left-0 text-left text-xs font-bold md:bg-transparent"></TableCell>

              {monthDays.map((_, dayIndex) => {
                const dayTotal = rows.reduce(
                  (sum, row) =>
                    sum +
                    (NOT_INCLUDE_IN_TOTAL.includes(row.key)
                      ? 0
                      : Number(
                          dataCash?.rowCashData?.[row.key]?.[dayIndex] || 0,
                        )),
                  0,
                );

                const isSelected = selectedDay === dayIndex + 1;

                return (
                  <TableCell
                    key={dayIndex}
                    className={cn(
                      "text-center",
                      rows[0].colorText,
                      isSelected && "text-rd",
                    )}
                  >
                    {dayTotal}
                  </TableCell>
                );
              })}
            </TableRow>

            <TableRow className="h-3 border-0" />
          </Fragment>
        );
      })} */}
    </TableBody>
  );
}
