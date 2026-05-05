import { GetCashData } from "@/app/actions/cash/cash-action";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { rowCashBar } from "@/features/cash/constants";
import { cn } from "@/lib/utils";
import { useMonthDays } from "@/providers/month-days-provider";
import { MONTHS } from "@/utils/get-month-days";

const INFO_KEYS = [
  { key: "start_241", label: "start 241", colorText: "text-foreground" },
  { key: "ao_532", label: "ao 532", colorText: "text-bl" },
  { key: "z_531", label: "z 531", colorText: "text-rd" },
];

function sumArray(arr: (string | undefined)[] = []) {
  return arr.reduce((acc, v) => acc + (Number(v) || 0), 0);
}

export default function CashYearPage({ data }: { data: GetCashData[] | null }) {
  const { year } = useMonthDays();
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

  const totalCell = "border-r pr-2 text-right text-xs";
  const labelCell =
    "bg-background sticky left-0 p-0 px-2 text-left font-medium md:bg-transparent";
  const dataCell = "border-x p-0 text-center text-xs";
  const rowCn = "[&>td]:py-0";

  return (
    <Table className="mt-4 md:table-fixed">
      <TableHeader className="bg-background sticky top-0 z-10">
        <TableRow className={cn(rowCn, "[&>td]:border-0")}>
          <TableCell className={cn(totalCell, "font-bold")}>{year}</TableCell>
          <TableCell className={cn(labelCell, "font-bold")} />

          {MONTHS.map((month) => (
            <TableCell key={month} className={cn(dataCell, "h-7 font-bold")}>
              {month.slice(0, 3).toUpperCase()}
            </TableCell>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow className="h-7" />

        {rowCashBar.map(({ key, label, colorText }) => {
          const yearTotal = getYearRowTotal(key);
          return (
            <TableRow key={key} className={cn(rowCn, "border-b!")}>
              <TableCell className={cn(totalCell, colorText)}>
                {yearTotal ? yearTotal.toFixed(2) : ""}
              </TableCell>
              <TableCell className={cn(labelCell, colorText)}>
                {label}
              </TableCell>
              {MONTHS.map((month) => {
                const total = getMonthRowTotal(month, key);
                return (
                  <TableCell key={month} className={cn(dataCell, colorText)}>
                    <div className="flex h-8 items-center justify-center px-2">
                      {total ? total.toFixed(2) : ""}
                    </div>
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}

        <TableRow className="h-6" />

        {INFO_KEYS.map(({ key, label, colorText }) => {
          const yearTotal = MONTHS.reduce((acc, month) => {
            const val =
              monthMap[month]?.[key as keyof (typeof monthMap)[string]];
            return acc + (Number(val) || 0);
          }, 0);

          return (
            <TableRow key={key} className={cn(rowCn, "border-b!")}>
              <TableCell className={cn(totalCell, colorText)}>
                {yearTotal ? yearTotal.toFixed(2) : ""}
              </TableCell>
              <TableCell className={cn(labelCell, colorText)}>
                {label}
              </TableCell>
              {MONTHS.map((month) => {
                const val =
                  monthMap[month]?.[key as keyof (typeof monthMap)[string]];
                const num = Number(val) || 0;
                return (
                  <TableCell key={month} className={cn(dataCell, colorText)}>
                    <div className="flex h-7 items-center justify-center">
                      {num ? num.toFixed(2) : ""}
                    </div>
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>

      <TableFooter className="bg-background sticky bottom-0 z-10">
        <TableRow className={rowCn}>
          <TableCell className={cn(totalCell, "text-gn font-bold")}>
            {(
              getYearRowTotal("cashBarByDay") +
              getYearRowTotal("visaBarByDay") +
              getYearRowTotal("banquetBarByDay")
            ).toFixed(2)}
          </TableCell>
          <TableCell className={cn(labelCell, "text-gn font-bold")}>
            total bar
          </TableCell>
          {MONTHS.map((month) => {
            const total =
              getMonthRowTotal(month, "cashBarByDay") +
              getMonthRowTotal(month, "visaBarByDay") +
              getMonthRowTotal(month, "banquetBarByDay");
            return (
              <TableCell
                key={month}
                className={cn(dataCell, "text-gn font-bold")}
              >
                <div className="flex h-7 items-center justify-center">
                  {total ? total.toFixed(2) : ""}
                </div>
              </TableCell>
            );
          })}
        </TableRow>
      </TableFooter>
    </Table>
  );
}
