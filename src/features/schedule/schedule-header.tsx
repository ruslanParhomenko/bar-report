import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { MonthDayType } from "@/utils/getMonthDays";
import ScheduleActionButton from "./schedule-action";

export default function ScheduleTableHeader({
  scheduleId,
  addNewRow,
  isSave = false,
  monthDays,
  month,
}: {
  scheduleId?: string;
  addNewRow?: () => void;
  isSave?: boolean;
  monthDays: MonthDayType[];
  month?: string;
}) {
  const todayDay = new Date().getDate();

  return (
    <TableHeader>
      <TableRow className="h-14!">
        <TableCell colSpan={4} className="w-44">
          <ScheduleActionButton
            scheduleId={scheduleId as string}
            isSave={isSave}
            addNewRow={addNewRow}
          />
        </TableCell>
        <TableCell
          className="w-8 print:hidden"
          data-html2canvas-ignore="true"
        ></TableCell>
        <TableCell className="text-base pl-3 w-36">
          {month?.toUpperCase() || ""}
        </TableCell>

        {monthDays?.map((day, _index) => {
          return (
            <TableCell
              key={day.day}
              className={cn(
                "w-10 cursor-pointer p-0",
                day.day === todayDay && "text-rd front-bold",
              )}
            >
              <div className="text-sm font-semibold text-center">{day.day}</div>
              <div className="text-xs text-muted-foreground text-center">
                {day.weekday}
              </div>
            </TableCell>
          );
        })}

        <TableCell className="w-6 p-0" />
      </TableRow>
    </TableHeader>
  );
}
