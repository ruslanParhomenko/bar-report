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

  return (
    <TableFooter>
      <TableRow>
        <TableCell colSpan={monthDays.length + 3} className="h-2 bg-bl" />
      </TableRow>
      <TableRow>
        <TableCell colSpan={3} className="sticky left-0 p-0 bg-card">
          cash tips
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
                <span className="text-center text-bl">{sumTipsForDay}</span>
                <input
                  {...form.register(`cashTips.${dayIndex}`)}
                  data-row={dataRowsCount}
                  data-col={dayIndex}
                  onKeyDown={(e) =>
                    handleTableNavigation(e, dataRowsCount, dayIndex)
                  }
                  className={cn("w-full h-6 bg-border text-sm text-center")}
                  disabled={disabled}
                />
                <span
                  className={cn(
                    "text-center text-xs text-muted-foreground",
                    Number(difference) < 0 ? "text-rd" : "text-gr"
                  )}
                >
                  {difference}
                </span>
              </div>
            </TableCell>
          );
        })}
      </TableRow>
    </TableFooter>
  );
}
