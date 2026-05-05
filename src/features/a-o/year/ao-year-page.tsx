import { GetAoData } from "@/app/actions/a-o/ao-action";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  rowsAdvance,
  rowsPurchaseModa,
  rowsPurchaseNMB,
} from "@/features/a-o/constants";
import { cn } from "@/lib/utils";
import { useMonthDays } from "@/providers/month-days-provider";
import { MONTHS } from "@/utils/get-month-days";
import React from "react";

const ALL_ROWS = [...rowsAdvance, ...rowsPurchaseModa, ...rowsPurchaseNMB];

function sumArray(arr: (string | undefined)[] = []) {
  return arr.reduce((acc, v) => acc + (Number(v) || 0), 0);
}

export default function AoYearPage({
  dataAoYear,
}: {
  dataAoYear: GetAoData[] | null;
}) {
  const { year } = useMonthDays();
  const monthMap = Object.fromEntries(
    (dataAoYear ?? []).map((d) => [d.id, d.aoData]),
  );

  const getMonthRowTotal = (month: string, key: string) => {
    const arr =
      monthMap[month]?.rowAOData?.[
        key as keyof (typeof monthMap)[string]["rowAOData"]
      ];
    return sumArray(arr as string[]);
  };

  const getYearRowTotal = (key: string) =>
    MONTHS.reduce((acc, month) => acc + getMonthRowTotal(month, key), 0);

  const totalCell = "border-r pr-2 text-right text-xs";
  const labelCell =
    "bg-background sticky left-0 p-0 px-2 text-left font-medium md:bg-transparent text-xs";
  const dataCell = "border-x p-0 text-center text-xs";
  const rowCn = "[&>td]:py-0";

  const GROUP_SEPARATORS = [
    rowsAdvance[rowsAdvance.length - 1].key,
    rowsPurchaseModa[rowsPurchaseModa.length - 1].key,
  ];

  return (
    <Table className="mt-4 md:table-fixed">
      <TableHeader>
        <TableRow className={cn(rowCn, "[&>td]:border-0")}>
          <TableCell className={cn(totalCell, "font-bold")}>{year}</TableCell>
          <TableCell className={cn(labelCell, "font-bold")} />

          {MONTHS.map((month) => (
            <TableCell
              key={month}
              className={cn(dataCell, "h-8 px-1 font-bold")}
            >
              {month.slice(0, 3).toUpperCase()}
            </TableCell>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow className="h-7" />
        {ALL_ROWS.map(({ key, label, colorText, type }) => {
          const isText = type === "text";
          const yearTotal = isText ? null : getYearRowTotal(key);

          return (
            <React.Fragment key={key}>
              {GROUP_SEPARATORS.includes(key) && (
                <TableRow key={`sep-${key}`} className="h-7" />
              )}
              <TableRow key={key} className={cn(rowCn, "border-b!")}>
                <TableCell className={cn(totalCell, colorText)}>
                  {!isText && yearTotal ? yearTotal.toFixed(2) : ""}
                </TableCell>
                <TableCell className={cn(labelCell, colorText)}>
                  {label}
                </TableCell>
                {MONTHS.map((month) => {
                  const arr =
                    monthMap[month]?.rowAOData?.[
                      key as keyof (typeof monthMap)[string]["rowAOData"]
                    ];
                  const total = isText ? null : sumArray(arr as string[]);
                  return (
                    <TableCell key={month} className={cn(dataCell, colorText)}>
                      <div className="flex h-8 items-center justify-center px-2">
                        {!isText && total ? total.toFixed(2) : ""}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            </React.Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
}
