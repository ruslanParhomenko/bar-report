"use client";
import { Table } from "@/components/ui/table";
import ScheduleTableFooter from "./schedule-footer";
import ScheduleTableHeader from "./schedule-header";
import ScheduleTableBody from "./schedule-body";
import { SchedulesContextValue } from "@/app/actions/schedule/schedule-action";
import { ValueParams } from "@/types/params";
import { useState } from "react";

export default function SchedulePage({
  schedule,
  params,
}: {
  schedule: SchedulesContextValue | null;
  params: ValueParams;
}) {
  const [selectedDay, setSelectedDay] = useState<string>("0");
  return (
    <Table className="table-fixed">
      <ScheduleTableHeader
        scheduleId={schedule?.id}
        params={params}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
      />
      <ScheduleTableBody schedule={schedule} selectedDay={selectedDay} />
      <ScheduleTableFooter
        schedule={schedule?.rowShifts ?? []}
        role={params.tab as string}
      />
    </Table>
  );
}
