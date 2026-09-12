import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GetScheduleData } from "@/features/schedule/schedule-edit/model/type";
import { GetTipsAddData } from "@/features/tips-add/model/type";
import { cn } from "@/lib/utils";

const EMPTY_SHIFT_CODES = ["v", "s", "x", "u", "/"];

export default function CompareScheduleTipsPage({
  dataTips,
  dataSchedule,
}: {
  dataTips: GetTipsAddData[] | null;
  dataSchedule: GetScheduleData | null;
}) {
  const days = dataTips
    ? [...dataTips].sort((a, b) => Number(a.id) - Number(b.id))
    : [];

  function normalizeScheduleValue(value: string | undefined | null): string {
    if (!value) return "";
    return EMPTY_SHIFT_CODES.includes(value) ? "" : value;
  }

  function getScheduleStart(value: string): string {
    if (!value) return "";
    return value.includes(".") ? value.split(".")[0] : value;
  }

  function getTipShift(dayId: string, employeeId: string): string | null {
    if (!dataTips) return null;
    const dayTip = dataTips.find((d) => d.id === dayId);
    if (!dayTip) return null;

    const entry = dayTip.tipsAdd.find((t) => t.idEmployee === employeeId);
    if (!entry || !entry.shift) return null;

    return entry.shift;
  }

  if (!dataTips || dataTips.length === 0) {
    return (
      <div className="text-muted-foreground p-4 text-sm">
        Нет данных по чаевым
      </div>
    );
  }

  if (!dataSchedule) {
    return (
      <div className="text-muted-foreground p-4 text-sm">
        Загрузка графика...
      </div>
    );
  }

  return (
    <Table className="mt-4">
      <TableHeader>
        <TableRow>
          <TableHead className="bg-background sticky left-0 z-10 w-30 truncate pr-1 pl-2" />

          {days.map((day) => (
            <TableHead
              key={day.id}
              className="w-8.5 border-x p-0 text-center text-xs"
            >
              {day.id}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {dataSchedule.rowShifts.map((row) => (
          <TableRow key={row.id} className="[&>td]:text-xs">
            <TableCell className="bg-background text-muted-foreground sticky left-0 truncate pr-1 pl-2 md:bg-transparent">
              {row.employee}
            </TableCell>
            {days.map((day) => {
              const dayIndex = Number(day.id) - 1;
              const rawScheduleValue = EMPTY_SHIFT_CODES.includes(
                row.shifts[dayIndex],
              )
                ? ""
                : (row.shifts[dayIndex] ?? "");
              const scheduleValue = normalizeScheduleValue(rawScheduleValue);
              const scheduleStart = getScheduleStart(scheduleValue);
              const tipShift = getTipShift(day.id, row.employeeId);
              const tipStart = tipShift ? tipShift.split("-")[0] : null;

              const hasSchedule = !!scheduleValue;
              const hasTip = tipShift !== null;

              let statusClass = "";
              let content: React.ReactNode = rawScheduleValue || "";

              if (hasSchedule && hasTip) {
                if (tipStart === scheduleStart) {
                  statusClass = "bg-green-500/20";
                } else {
                  statusClass = "bg-red-500/20";
                  content = (
                    <>
                      {rawScheduleValue}
                      <span className="text-rd">
                        {" "}
                        (t:{tipShift.split("-")[0]})
                      </span>
                    </>
                  );
                }
              } else if (hasSchedule && !hasTip) {
                statusClass = "bg-amber-500/20";
                content = (
                  <>
                    {rawScheduleValue}
                    <span className="text-amber-600"> (?)</span>
                  </>
                );
              } else if (!hasSchedule && hasTip) {
                statusClass = "bg-blue-500/20";
                content = (
                  <span className="text-blue-600">
                    (t:{tipShift.split("-")[0]})
                  </span>
                );
              }
              return (
                <TableCell
                  key={day.id}
                  className={cn(
                    "border-x p-0 text-center text-xs",
                    statusClass,
                  )}
                >
                  {content}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
