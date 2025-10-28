import { Button } from "@/components/ui/button";
import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { MonthDayType } from "@/utils/getMonthDays";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";

export default function ScheduleHeader({
  monthDays,
  setSelectedColumn,
  month,
  addNewRow,
}: {
  monthDays: MonthDayType[];
  setSelectedColumn?: (index: number) => void;
  month?: string;
  addNewRow?: () => void;
}) {
  const { id } = useParams();
  const todayDay = new Date().getDate();

  return (
    <TableHeader>
      <TableRow>
        <TableCell className="w-2 text-start p-0">
          <Button
            onClick={addNewRow && addNewRow}
            variant="ghost"
            size="sm"
            type="button"
            className="cursor-pointer hover:bg-bl/40"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </TableCell>
        <TableCell className="w-6" />
        <TableCell className="w-6" />
        <TableCell className="w-10" />
        <TableCell className="w-32 p-0 front-bold text-center">
          {month?.toUpperCase() || ""}
        </TableCell>
        {id && (
          <TableCell
            className="w-10 p-0 no-print"
            data-html2canvas-ignore="true"
          />
        )}
        <TableCell
          className="w-4 p-0 no-print"
          data-html2canvas-ignore="true"
        />

        {monthDays.map((day, index) => {
          return (
            <TableCell
              key={day.day}
              className={cn(
                "w-10 cursor-pointer p-0",
                day.day === todayDay && "text-rd front-bold"
              )}
              onClick={() => setSelectedColumn && setSelectedColumn(index)}
            >
              <div className="text-sm font-semibold text-center">{day.day}</div>
              <div className="text-xs text-muted-foreground text-center">
                {day.weekday}
              </div>
            </TableCell>
          );
        })}

        <TableCell className="w-6" />
      </TableRow>
    </TableHeader>
  );
}
