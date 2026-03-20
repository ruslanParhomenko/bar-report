import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getMonthDays } from "@/utils/get-month-days";
import ScheduleActionButton from "./schedule-action";
import { PageParams } from "@/types/params";

type ScheduleTableHeaderProps = {
  scheduleId?: string;
  addNewRow?: () => void;
  isSave?: boolean;
  params: PageParams;
};

export default function ScheduleTableHeader({
  scheduleId,
  addNewRow,
  isSave = false,
  params,
}: ScheduleTableHeaderProps) {
  const { month, year } = params;
  const todayDay = new Date().getDate();
  const monthDays = getMonthDays({ month, year });

  return (
    <TableHeader>
      <TableRow className="h-14!">
        <TableCell colSpan={5} className="w-40">
          <ScheduleActionButton
            scheduleId={scheduleId}
            isSave={isSave}
            addNewRow={addNewRow}
            params={params}
          />
        </TableCell>
        <TableCell className="text-base pl-3 w-32">
          {month?.toUpperCase() || ""}
        </TableCell>
        <TableCell className="w-8" />

        {monthDays?.map((day) => (
          <TableCell
            key={day.day}
            className={cn(
              "w-10.5 cursor-pointer p-0",
              day.day === todayDay && "text-rd font-bold",
            )}
          >
            <div className="flex flex-col items-center">
              <span className="text-sm font-semibold">{day.day}</span>
              <span className="text-xs text-muted-foreground">
                {day.weekday}
              </span>
            </div>
          </TableCell>
        ))}

        {isSave && <TableCell className="w-6 p-0" />}
      </TableRow>
    </TableHeader>
  );
}
