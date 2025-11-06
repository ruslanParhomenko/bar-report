import { Label } from "@/components/ui/label";
import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { handleTableNavigation } from "@/utils/handleTableNavigation";
import { UseFormReturn } from "react-hook-form";

export default function TableFooterData({
  monthDays,
  disabled,
  form,
  dataRowsCount,
}: {
  monthDays: { day: number; weekday: string }[];
  disabled?: boolean;
  form: UseFormReturn<any>;
  dataRowsCount: number;
}) {
  if (!monthDays) return null;

  const value = form.watch("rowEmployeesTips").map((row: any) => row.tipsByDay);

  const totalTips = form
    .watch("rowEmployeesTips")
    .map((row: any) => row.tips)
    .reduce((acc: number, val: string) => acc + Number(val), 0);
  const totalCash = form
    .watch("cashTips")
    .reduce((acc: number, val: string) => acc + Number(val), 0);

  return (
    <TableFooter>
      <TableRow>
        <TableCell colSpan={monthDays.length + 4} className="h-2 bg-bl" />
      </TableRow>
      <TableRow>
        <TableCell colSpan={2} className="sticky left-0 p-0 bg-card">
          cash tips
        </TableCell>
        <TableCell className="px-1">
          <div className="flex flex-col items-center gap-2">
            <Label className="text-center text-xs">{totalTips}</Label>
            <Label className="text-center text-xs">{totalCash}</Label>
            <Label className="text-center text-xs">
              {totalTips - totalCash}
            </Label>
          </div>
        </TableCell>
        {monthDays.map((_day, dayIndex) => {
          const sumTipsForDay = value.reduce(
            (acc: number, tipsByDay: any[]) => {
              const tipValue = parseFloat(tipsByDay[dayIndex]) || 0;
              return acc + tipValue;
            },
            0
          );

          const cashForDay = form.getValues(`cashTips.${dayIndex}`);
          const difference = (Number(cashForDay) - Number(sumTipsForDay))
            .toFixed(0)
            .toString();
          return (
            <TableCell key={dayIndex} className="p-1 h-6">
              <div className="flex flex-col items-center gap-1">
                <Label className="text-center text-xs text-bl">
                  {sumTipsForDay}
                </Label>
                <input
                  {...form.register(`cashTips.${dayIndex}`)}
                  data-row={dataRowsCount}
                  data-col={dayIndex}
                  onKeyDown={(e) =>
                    handleTableNavigation(e, dataRowsCount, dayIndex)
                  }
                  className={cn("w-full h-6  text-xs text-center")}
                  disabled={disabled}
                />
                <Label
                  className={cn(
                    "text-center text-xs text-muted-foreground",
                    Number(difference) < 0 ? "text-rd" : "text-gr"
                  )}
                >
                  {difference}
                </Label>
              </div>
            </TableCell>
          );
        })}
      </TableRow>
    </TableFooter>
  );
}
