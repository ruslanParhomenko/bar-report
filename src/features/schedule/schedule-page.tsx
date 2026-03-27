"use client";
import { Table } from "@/components/ui/table";
import ScheduleTableFooter from "./schedule-footer";
import ScheduleTableHeader from "./schedule-header";
import ScheduleTableBody from "./schedule-body";
import { SchedulesContextValue } from "@/app/actions/schedule/schedule-action";
import { ValueParams } from "@/types/params";
import { useState } from "react";
import { useHashParam } from "@/hooks/use-hash";

export default function SchedulePage({
  schedules,
  params,
}: {
  schedules: SchedulesContextValue[] | null;
  params: ValueParams;
}) {
  const [tab] = useHashParam("tab");

  const schedule = schedules?.find((s: any) => s.role === tab) ?? null;

  const [selectedDay, setSelectedDay] = useState<string>("0");
  return (
    <Table className="table-fixed">
      <ScheduleTableHeader
        scheduleId={schedule?.id}
        params={params}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        tab={tab as string}
      />
      <ScheduleTableBody schedule={schedule} selectedDay={selectedDay} />
      <ScheduleTableFooter
        schedule={schedule?.rowShifts ?? []}
        role={tab as string}
      />
    </Table>
  );
}
