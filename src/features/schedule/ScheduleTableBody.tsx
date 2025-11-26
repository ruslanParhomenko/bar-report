"use client";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { color } from "./create/constants";
import {
  SchedulesContextValue,
  useSchedules,
} from "@/providers/ScheduleProvider";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAbility } from "@/providers/AbilityProvider";
import ScheduleTableFooter from "./ScheduleTableFooter";
import { getShiftCounts } from "./utils";
import ScheduleTableHeader from "./ScheduleTableHeader";
import { getMonthDays } from "@/utils/getMonthDays";
import { usePrint } from "@/hooks/useToPrint";
import { useTelegramScreenshot } from "@/hooks/useTelegramScreenshot";
import ScheduleActionButton from "./ScheduleActionButton";

export default function ScheduleTableBody({ patch }: { patch: string }) {
  const { isAdmin, isManager } = useAbility();
  const isView = isAdmin || isManager;

  const params = useSearchParams();
  const month = params.get("month") as string;
  const year = params.get("year") as string;

  const [schedule, setSchedule] = useState<SchedulesContextValue | null>(null);
  const [scheduleId, setScheduleId] = useState<string | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null);

  const schedules = useSchedules();

  useEffect(() => {
    if (!patch || !month || !year) return;
    if (!schedules) return;

    const uniqueKey = `${year}-${month}-${patch}`;
    const found = schedules.find((s) => s.uniqueKey === uniqueKey);

    setSchedule(found || null);
    setScheduleId(found?.uniqueKey || null);
  }, [patch, month, year, schedules]);

  const shiftCounts = getShiftCounts(schedule as any);

  const monthDays = useMemo(() => {
    if (!month || !year) return [];
    return getMonthDays({ month: month, year: year });
  }, [month, year]);

  const todayDay = new Date().getDate();
  const todayIndex = monthDays.findIndex((day) => day.day === todayDay);
  useEffect(() => {
    if (todayIndex !== -1) {
      setSelectedColumn(todayIndex);
    }
  }, [todayIndex]);

  const { componentRef, handlePrint } = usePrint({ title: "schedule" });
  const { sendScreenshot, isSending } = useTelegramScreenshot({
    ref: componentRef as React.RefObject<HTMLElement>,
    tagName: patch as string,
  });

  return (
    <>
      <ScheduleActionButton
        handlePrint={handlePrint}
        sendScreenshot={sendScreenshot}
        isSending={isSending}
        patch={patch}
        scheduleId={scheduleId as string}
      />
      {schedule && (
        <Table className="md:table-fixed" ref={componentRef as any}>
          <ScheduleTableHeader setSelectedColumn={setSelectedColumn} />
          <TableBody>
            {schedule?.rowShifts?.map((row, rowIndex) => {
              const isSelected = !["v", "s", ""].includes(
                row.shifts?.[selectedColumn as number]
              );
              const dayHourPay =
                row.role === "mngr"
                  ? Number(row.rate) / 186
                  : (Number(row.rate) / 186) * 0.9;
              const nightHourPay =
                row.role === "mngr"
                  ? Number(row.rate) / 186
                  : (Number(row.rate) / 186) * 1.15;
              const totalPay =
                dayHourPay * Number(row.dayHours) +
                nightHourPay * Number(row.nightHours);

              return (
                <TableRow key={row.id} className="hover:text-rd">
                  <TableCell>{rowIndex + 1}</TableCell>
                  <TableCell className="text-bl text-xs">
                    {row.dayHours}
                  </TableCell>
                  <TableCell className="text-bl text-xs">
                    {row.nightHours}
                  </TableCell>
                  <TableCell>{row.totalHours}</TableCell>
                  <TableCell
                    className={cn(
                      "sticky left-0 bg-card/40 text-muted-foreground w-34 p-0",
                      isSelected && "text-rd font-bold"
                    )}
                  >
                    {row.employee}
                  </TableCell>
                  <TableCell
                    className="w-2 p-0 text-start text-xs  no-print"
                    data-html2canvas-ignore="true"
                  >
                    {isView && totalPay.toFixed(0).toString()}
                  </TableCell>

                  {row.shifts?.map((day, dayIndex) => {
                    const isSelected = dayIndex === selectedColumn;

                    return (
                      <TableCell
                        key={dayIndex}
                        className={cn(
                          "p-0 text-center border-x",
                          color[day as keyof typeof color],
                          isSelected && "!text-rd font-bold",
                          dayIndex === row.shifts.length - 1 && "border-r-0"
                        )}
                      >
                        {["/", "v", "s"].includes(day) ? null : day}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
          <ScheduleTableFooter shiftCounts={shiftCounts} />
        </Table>
      )}
    </>
  );
}
