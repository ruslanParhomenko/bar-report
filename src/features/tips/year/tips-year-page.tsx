import { GetTipsData } from "@/app/actions/tips/tips-action";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { calculateTipsTotal } from "@/features/tips/utils";
import { cn } from "@/lib/utils";
import { useMonthDays } from "@/providers/month-days-provider";
import { MONTHS } from "@/utils/get-month-days";

function sumArray(arr: (string | undefined)[] = []) {
  return arr.reduce((acc, v) => acc + (Number(v) || 0), 0);
}

export default function TipsYearPage({
  dataTipsYear,
}: {
  dataTipsYear: GetTipsData[] | null;
}) {
  const { year } = useMonthDays();

  const monthMap = Object.fromEntries(
    (dataTipsYear ?? []).map((d) => [d.id, d.tipsData]),
  );

  // собираем всех уникальных сотрудников по имени
  const allEmployees = Array.from(
    new Map(
      (dataTipsYear ?? [])
        .flatMap((d) => d.tipsData.rowEmployeesTips)
        .map((e) => [e.employee.trim(), e]),
    ).values(),
  );

  const getEmployeeMonthTotal = (employeeName: string, month: string) => {
    const monthData = monthMap[month];
    if (!monthData) return 0;
    const emp = monthData.rowEmployeesTips.find(
      (e) => e.employee.trim() === employeeName.trim(),
    );
    if (!emp) return 0;
    return sumArray(emp.tipsByDay as string[]);
  };

  const getEmployeeYearTotal = (employeeName: string) =>
    MONTHS.reduce(
      (acc, month) => acc + getEmployeeMonthTotal(employeeName, month),
      0,
    );

  const getMonthCashTotal = (month: string) =>
    sumArray(monthMap[month]?.rowCashTips as string[]);

  const getMonthAllEmployeesTotal = (month: string) => {
    const monthData = monthMap[month];
    if (!monthData) return 0;
    const { totalAll } = calculateTipsTotal(monthData.rowEmployeesTips);
    return totalAll;
  };

  const totalCell = "border-r pr-2 text-right text-xs";
  const labelCell =
    "bg-background sticky left-0 p-0 px-2 text-left font-medium md:bg-transparent text-xs";
  const dataCell = "border-x p-0 text-center text-xs";
  const rowCn = "[&>td]:py-0";

  return (
    <Table className="md:table-fixed">
      <TableHeader className="bg-background sticky top-0 z-10">
        <TableRow className={cn(rowCn, "[&>td]:border-0")}>
          <TableCell className={cn(totalCell, "w-20 font-bold")}>
            {year}
          </TableCell>
          <TableCell className={cn(labelCell, "w-40 font-bold")}>
            сотрудник
          </TableCell>
          <TableCell className={cn(dataCell, "w-18 text-xs font-bold")} />

          {MONTHS.map((month) => (
            <TableCell
              key={month}
              className={cn(dataCell, "h-7 px-2 font-bold")}
            >
              {month.slice(0, 3).toUpperCase()}
            </TableCell>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow className="h-4" />

        {allEmployees.map((emp) => {
          const yearTotal = getEmployeeYearTotal(emp.employee);
          const colorText =
            emp.role === "barmen" ? "text-bl" : "text-foreground";
          return (
            <TableRow
              key={`${emp.id}-${emp.employee}`}
              className={cn(rowCn, "border-b!")}
            >
              <TableCell className={cn(totalCell, colorText)}>
                {yearTotal ? yearTotal.toFixed(0) : ""}
              </TableCell>
              <TableCell className={cn(labelCell, colorText)}>
                {emp.employee.trim()}
              </TableCell>
              <TableCell className={cn(dataCell, "text-muted-foreground px-1")}>
                <div className="flex h-6 items-center justify-center">
                  {emp.role.slice(0, 1).toUpperCase()}
                </div>
              </TableCell>
              {MONTHS.map((month) => {
                const total = getEmployeeMonthTotal(emp.employee, month);
                return (
                  <TableCell key={month} className={cn(dataCell, colorText)}>
                    <div className="flex h-6 items-center justify-center px-2">
                      {total ? total.toFixed(0) : ""}
                    </div>
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}

        <TableRow className="h-6" />

        {/* строка кассовых чаевых */}
        <TableRow className={cn(rowCn, "border-b!")}>
          <TableCell className={cn(totalCell, "text-rd")}>
            {MONTHS.reduce((acc, m) => acc + getMonthCashTotal(m), 0).toFixed(
              0,
            )}
          </TableCell>
          <TableCell className={cn(labelCell, "text-rd")}>cash tips</TableCell>
          <TableCell className={cn(dataCell)} />
          {MONTHS.map((month) => {
            const total = getMonthCashTotal(month);
            return (
              <TableCell key={month} className={cn(dataCell, "text-rd")}>
                <div className="flex h-7 items-center justify-center">
                  {total ? total.toFixed(0) : ""}
                </div>
              </TableCell>
            );
          })}
        </TableRow>
      </TableBody>

      <TableFooter className="bg-background sticky bottom-0 z-10">
        <TableRow className={rowCn}>
          <TableCell className={cn(totalCell, "font-bold")}>
            {MONTHS.reduce(
              (acc, m) => acc + getMonthAllEmployeesTotal(m),
              0,
            ).toFixed(0)}
          </TableCell>
          <TableCell className={cn(labelCell, "font-bold")}>
            total tips
          </TableCell>
          <TableCell className={cn(dataCell)} />
          {MONTHS.map((month) => {
            const total = getMonthAllEmployeesTotal(month);
            return (
              <TableCell key={month} className={cn(dataCell, "font-bold")}>
                <div className="flex h-7 items-center justify-center">
                  {total ? total.toFixed(0) : ""}
                </div>
              </TableCell>
            );
          })}
        </TableRow>
      </TableFooter>
    </Table>
  );
}
