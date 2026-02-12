"use client";
import { Table } from "@/components/ui/table";
import ScheduleTableFooter from "./schedule-footer";
import ScheduleTableHeader from "./schedule-header";
import { MonthDayType } from "@/utils/getMonthDays";
import ScheduleTableBody from "./schedule-body";
import { SchedulesContextValue } from "@/app/actions/schedule/scheduleAction";
import { useSearchParams } from "next/navigation";

export default function SchedulePage({
  schedule,
  monthDays,
  month,
  isView,
}: {
  schedule: SchedulesContextValue[] | null;
  monthDays: MonthDayType[];
  month?: string;
  isView: boolean;
}) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") as string;
  const scheduleByTab = schedule?.find((s: any) => s.role === tab);
  return (
    <Table className="table-fixed">
      <ScheduleTableHeader
        scheduleId={scheduleByTab?.id}
        monthDays={monthDays}
        month={month}
      />
      <ScheduleTableBody schedule={scheduleByTab} isView={isView} />
      <ScheduleTableFooter schedule={scheduleByTab} />
    </Table>
  );
}
