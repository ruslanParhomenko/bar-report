import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useMonthDays } from "@/providers/month-days-provider";
import { handleMultiTableNavigation } from "@/utils/handle-table-navigation";
import { useFormContext, useWatch } from "react-hook-form";
import { calculateTipsTotal } from "./utils";

export function TipsTableFooter({ isEdit }: { isEdit: boolean }) {
  const { monthDays } = useMonthDays();
  if (!monthDays) return null;

  const { control, register } = useFormContext();

  const value =
    useWatch({
      control: control,
      name: "rowEmployeesTips",
    }) || [];
  const cashValue =
    useWatch({
      control: control,
      name: "rowCashTips",
    }) || [];

  const { totalAll: totalTips } = calculateTipsTotal(value);
  const totalCash = cashValue?.reduce(
    (acc: number, val: string) => acc + Number(val || 0),
    0,
  );

  return (
    <TableFooter>
      <TableRow className="h-4 border-b-0" />
      <TableRow>
        <TableCell colSpan={2} className="sticky left-0 p-1">
          {isEdit ? "Cash" : ""}
        </TableCell>

        <TableCell className="p-1">
          <div className="flex flex-col items-center gap-2">
            <div className="text-center text-xs">{totalTips}</div>
            <div className="text-center text-xs">{totalCash}</div>
            <div className="text-center text-xs">{totalTips - totalCash}</div>
          </div>
        </TableCell>
        {monthDays.map((_day, dayIndex) => {
          const sumTipsForDay = value.reduce((acc: number, employee: any) => {
            const tip = employee.tipsByDay?.[dayIndex] || "0";
            return acc + Number(tip || 0);
          }, 0);

          const cashForDay = Number(cashValue?.[dayIndex]) || 0;
          const differenceNum = cashForDay - sumTipsForDay;

          return (
            <TableCell key={dayIndex} className="p-1">
              <div className="flex flex-col items-center gap-2">
                <div className="text-bl text-center text-xs">
                  {sumTipsForDay}
                </div>

                <input
                  type="text"
                  data-col={dayIndex}
                  {...register(`rowCashTips.${dayIndex}`)}
                  className={cn(
                    "w-full text-center text-xs",
                    isEdit ? "bg-border border" : "border-0",
                  )}
                  onKeyDown={handleMultiTableNavigation}
                  disabled={!isEdit}
                />
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
