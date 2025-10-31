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
  return (
    <TableFooter>
      <TableRow>
        <TableCell colSpan={monthDays.length + 3} className="h-2 bg-bl" />
      </TableRow>
      <TableRow>
        <TableCell colSpan={2} className="sticky left-0 p-0 bg-card">
          cash tips
        </TableCell>
        {monthDays.map((_day, dayIndex) => (
          <TableCell key={dayIndex} className="p-1 h-6">
            <input
              {...form.register(`cashTips.tipsByDay.${dayIndex}`)}
              data-row={dataRowsCount}
              data-col={dayIndex}
              onKeyDown={(e) =>
                handleTableNavigation(e, dataRowsCount, dayIndex)
              }
              className={cn("w-full h-6 bg-border text-sm text-center")}
              disabled={disabled}
            />
          </TableCell>
        ))}
      </TableRow>
    </TableFooter>
  );
}
