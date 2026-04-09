import { Label } from "@/components/ui/label";
import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { UseFormReturn, useWatch } from "react-hook-form";
import { calculateTipsTotal } from "./utils";

export function TipsTableFooter({
  monthDays,
  form,
}: {
  monthDays: { day: number; weekday: string }[];
  form: UseFormReturn<any>;
}) {
  if (!monthDays) return null;

  const value = useWatch({
    control: form.control,
    name: "rowEmployeesTips",
  });
  const cashValue = useWatch({
    control: form.control,
    name: "rowCashTips",
  });

  const { totalAll: totalTips } = calculateTipsTotal(value);
  const totalCash = cashValue?.reduce(
    (acc: number, val: string) => acc + Number(val || 0),
    0,
  );

  return (
    <TableFooter>
      <TableRow>
        <TableCell colSpan={2} className="sticky left-0 p-1">
          cash tips
        </TableCell>
        <TableCell className="px-1 p-1">
          <div className="flex flex-col items-center gap-2">
            <Label className="text-center text-xs">{totalTips}</Label>
            <Label className="text-center text-xs">{totalCash}</Label>
            <Label className="text-center text-xs">
              {totalTips - totalCash}
            </Label>
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
                <Label className="text-center text-xs text-bl">
                  {sumTipsForDay}
                </Label>
                <Label className="text-xs">{cashValue?.[dayIndex]}</Label>
                <Label
                  className={cn(
                    "text-center text-xs text-muted-foreground",
                    differenceNum < 0 ? "text-rd" : "text-gr",
                  )}
                >
                  {differenceNum.toFixed(0)}
                </Label>
              </div>
            </TableCell>
          );
        })}
      </TableRow>
    </TableFooter>
  );
}
