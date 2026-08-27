import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { GetTipsData } from "@/features/staff/tips/model/type";
import { cn } from "@/lib/utils";
import { calculateTipsTotal } from "../../lib/utils";

export function TipsViewTableFooter({
  data,
  monthDays,
}: {
  data: GetTipsData["tipsData"];
  monthDays: { day: number; weekday: string }[];
}) {
  if (!monthDays || !data) return null;

  const { totalAll: totalTips } = calculateTipsTotal(data.rowEmployeesTips);
  const totalCash = data.rowCashTips?.reduce(
    (acc: number, val: string) => acc + Number(val || 0),
    0,
  );

  return (
    <TableFooter>
      <TableRow className="h-4 border-b-0" />
      <TableRow>
        <TableCell colSpan={2} className="sticky left-0 p-1 text-center">
          {"cash"}
        </TableCell>

        <TableCell className="p-1">
          <div className="flex flex-col items-center gap-2">
            <div className="text-center text-xs">{totalTips}</div>
            <div className="text-center text-xs">{totalCash}</div>
            <div className="text-center text-xs">{totalTips - totalCash}</div>
          </div>
        </TableCell>
        {monthDays.map((_day, dayIndex) => {
          const sumTipsForDay = data.rowEmployeesTips.reduce(
            (acc: number, employee: any) => {
              const tip = employee.tipsByDay?.[dayIndex] || "0";
              return acc + Number(tip || 0);
            },
            0,
          );

          const cashForDay = Number(data.rowCashTips?.[dayIndex]) || 0;
          const differenceNum = cashForDay - sumTipsForDay;

          return (
            <TableCell key={dayIndex} className="p-1">
              <div className="flex flex-col items-center gap-2">
                <div className="text-bl text-center text-xs">
                  {sumTipsForDay}
                </div>

                <div>
                  <div
                    className={cn(
                      "text-muted-foreground text-center text-xs",
                      differenceNum < 0 ? "text-rd" : "text-gr",
                    )}
                  >
                    {cashForDay}
                  </div>
                </div>
                <div
                  className={cn(
                    "text-muted-foreground text-center text-xs",
                    differenceNum < 0 ? "text-rd" : "text-gr",
                  )}
                >
                  {differenceNum.toFixed(0)}
                </div>
              </div>
            </TableCell>
          );
        })}
      </TableRow>
    </TableFooter>
  );
}
