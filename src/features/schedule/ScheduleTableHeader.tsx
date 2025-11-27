import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getMonthDays } from "@/utils/getMonthDays";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import ScheduleActionButton from "./ScheduleActionButton";

export default function ScheduleTableHeader({
  setSelectedColumn,
  componentRef,
  scheduleId,
  addNewRow,
  isSave = false,
}: {
  setSelectedColumn?: (index: number) => void;
  componentRef?: React.RefObject<HTMLDivElement | null>;
  scheduleId?: string;
  addNewRow?: () => void;
  isSave?: boolean;
}) {
  const { id } = useParams();

  const params = useSearchParams();
  const month = params.get("month") as string;
  const year = params.get("year") as string;

  const todayDay = new Date().getDate();

  const monthDays = getMonthDays({ month: month, year: year });

  const todayIndex = monthDays.findIndex((day) => day.day === todayDay);
  useEffect(() => {
    if (!setSelectedColumn) return;
    if (todayIndex !== -1) {
      setSelectedColumn(todayIndex);
    }
  }, [todayIndex]);

  return (
    <TableHeader>
      <TableRow className="h-12!">
        <TableCell colSpan={5} className="text-start p-0">
          {/* {id && isCreate && (
            <Button
              onClick={addNewRow && addNewRow}
              variant="ghost"
              size="sm"
              type="button"
              className="cursor-pointer hover:bg-bl/40"
            >
              <Plus className="h-3 w-3" />
            </Button>
          )} */}
          <ScheduleActionButton
            ref={componentRef}
            scheduleId={scheduleId as string}
            isSave={isSave}
            addNewRow={addNewRow}
          />
        </TableCell>
        <TableCell className="front-bold text-center">
          {month?.toUpperCase() || ""}
        </TableCell>

        {monthDays.map((day, index) => {
          return (
            <TableCell
              key={day.day}
              className={cn(
                "w-12 cursor-pointer p-0",
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

        <TableCell className="w-6 p-0" />
      </TableRow>
    </TableHeader>
  );
}
