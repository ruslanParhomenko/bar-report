"use client";
import { Table } from "@/components/ui/table";
import ScheduleTableFooter from "./schedule-footer";
import ScheduleTableHeader from "./schedule-header";
import { getMonthDays, MonthDayType } from "@/utils/get-month-days";
import ScheduleTableBody from "./schedule-body";
import { SchedulesContextValue } from "@/app/actions/schedule/schedule-action";
import { useSearchParams } from "next/navigation";

export default function SchedulePage({
  schedule,
  month,
  year,
  isView,
}: {
  schedule: SchedulesContextValue[] | null;
  month: string;
  year: string;
  isView: boolean;
}) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") as string;
  const scheduleByTab = schedule?.find((s: any) => s.role === tab) || null;

  const monthDays = getMonthDays({ month, year });

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
