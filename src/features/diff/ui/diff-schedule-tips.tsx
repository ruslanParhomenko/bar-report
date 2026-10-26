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
import { useMonthDays } from "@/hooks/use-month-days";
import { cn } from "@/lib/utils";

const EMPTY_SHIFT_CODES = ["v", "s", "x", "u", "/"];

export default function DiffScheduleTips({
  dataTips,
  dataSchedule,
}: {
  dataTips: GetTipsAddData[] | null;
  dataSchedule: GetScheduleData | null;
}) {
  const { monthDays } = useMonthDays();

  const days = monthDays.map((d) => d.day);
  const rowsShiftsSchedule = dataSchedule?.rowShifts || [];
  const names =
    rowsShiftsSchedule
      .map((r) => ({
        name: r.employee?.trim() ?? "",
        id: r.employeeId,
      }))
      .sort((a, b) => a.name.localeCompare(b.name)) || [];

  function getScheduleStart(value: string | undefined | null): number {
    if (!value) return 0;
    const numberValue = value.includes(".")
      ? Number(value.split(".")[0])
      : Number(value);

    if (isNaN(numberValue)) return 0;
    return numberValue;
  }

  function getTipShift(dayId: number, employeeId: string): number {
    if (!dataTips) return 0;
    const dayTip = dataTips.find((d) => d.id === dayId.toString());
    if (!dayTip) return 0;

    const entry = dayTip.tipsAdd.find((t) => t.idEmployee === employeeId);
    if (!entry || !entry.shift) return 0;

    const valueBayDayTips = entry.shift.split("-")[0];

    return Number(valueBayDayTips);
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
    <Table className="mt-8 table-auto">
      <TableHeader>
        <TableRow>
          <TableHead />
          <TableHead className="bg-background sticky left-0 z-10 w-30 truncate pr-1 pl-2 text-xs">
            schedule - tips
          </TableHead>

          {days.map((day) => (
            <TableHead
              key={day}
              className="w-8.5 border-x p-0 text-center text-xs"
            >
              {day}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {names.map((n, i) => (
          <TableRow
            key={n.id}
            className={cn(
              "group cursor-pointer",
              "[&>td]:px-1 [&>td]:py-1.5 [&>td]:text-xs [&>td]:transition-colors",
              "hover:[&>td]:bg-muted",
            )}
          >
            <TableCell className={cn("text-rd w-6 text-[11px]!")}>
              {i + 1}
            </TableCell>
            <TableCell className="bg-background group-hover:text-gn sticky left-0 z-10 w-30 truncate pr-1 pl-2">
              {n.name}
            </TableCell>

            {days.map((d) => {
              const valueByDaySchedule = rowsShiftsSchedule.find(
                (row) => row.employeeId === n.id,
              )?.shifts[d - 1];
              const hoursSchedule = getScheduleStart(valueByDaySchedule);
              const hoursTips = getTipShift(d, n.id);
              const isEqual = hoursSchedule === hoursTips;
              return (
                <TableCell
                  key={d}
                  className={cn(
                    "group-hover:text-gn w-12.5 border-x text-center text-xs",
                    isEqual
                      ? "text-gr/40"
                      : hoursSchedule !== 0 && hoursTips === 0
                        ? "text-gn! bg-accent font-bold"
                        : "text-rd! bg-accent font-bold",
                  )}
                >
                  {hoursSchedule !== 0
                    ? `${hoursSchedule} `
                    : hoursTips !== 0
                      ? "- "
                      : ""}
                  {hoursTips !== 0
                    ? `: ${hoursTips}`
                    : hoursSchedule !== 0
                      ? ":"
                      : ""}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
