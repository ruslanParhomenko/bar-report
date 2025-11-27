"use client";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { color } from "./create/constants";
import {
  SchedulesContextValue,
  useSchedules,
} from "@/providers/ScheduleProvider";
import { useEffect, useRef, useState } from "react";
import { useAbility } from "@/providers/AbilityProvider";
import ScheduleTableFooter from "./ScheduleTableFooter";
import { calculateSalaryByHours } from "./utils";
import ScheduleTableHeader from "./ScheduleTableHeader";

export default function ScheduleTableBody({
  uniqueKey,
}: {
  uniqueKey: string;
}) {
  const { isAdmin, isManager } = useAbility();
  const isView = isAdmin || isManager;

  const [schedule, setSchedule] = useState<SchedulesContextValue | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null);

  const schedules = useSchedules();

  useEffect(() => {
    if (!uniqueKey) return;
    const found = schedules.find((s) => s.uniqueKey === uniqueKey);

    if ("startViewTransition" in document) {
      // @ts-ignore
      document.startViewTransition(() => {
        setSchedule(found || null);
      });
    } else {
      setSchedule(found || null);
    }
  }, [uniqueKey, schedules]);

  const componentRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <Table ref={componentRef as any}>
        <ScheduleTableHeader
          setSelectedColumn={setSelectedColumn}
          componentRef={componentRef}
          scheduleId={schedule?.id as string}
        />

        <TableBody>
          {schedule?.rowShifts?.map((row, rowIndex) => {
            const isSelected = !["v", "s", ""].includes(
              row.shifts?.[selectedColumn as number]
            );

            const totalPay = calculateSalaryByHours(row);

            return (
              <TableRow key={row.id} className="hover:text-rd">
                <TableCell>{rowIndex + 1}</TableCell>
                <TableCell className="text-bl text-xs">
                  {row.dayHours}
                </TableCell>
                <TableCell className="text-bl text-xs">
                  {row.nightHours}
                </TableCell>
                <TableCell className="font-bold">{row.totalHours}</TableCell>
                <TableCell
                  className="text-xs text-gn no-print"
                  data-html2canvas-ignore="true"
                >
                  {isView && totalPay.toFixed(0).toString()}
                </TableCell>
                <TableCell
                  className={cn(
                    "sticky left-0 bg-card/40 text-muted-foreground",
                    isSelected && "text-rd font-bold"
                  )}
                >
                  {row.employee}
                </TableCell>

                {row.shifts?.map((day, dayIndex) => {
                  const isSelected = dayIndex === selectedColumn;

                  return (
                    <TableCell
                      key={dayIndex}
                      className={cn(
                        "text-center border-x",
                        color[day as keyof typeof color],
                        isSelected && "!text-rd font-bold"
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

        <ScheduleTableFooter schedule={schedule} />
      </Table>
    </>
  );
}
