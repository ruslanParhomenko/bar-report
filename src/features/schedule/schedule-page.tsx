import { Table } from "@/components/ui/table";
import ScheduleTableFooter from "./schedule-footer";
import ScheduleTableHeader from "./schedule-header";
import { MonthDayType } from "@/utils/getMonthDays";
import ScheduleTableBody from "./schedule-body";
import { SchedulesContextValue } from "@/app/actions/schedule/scheduleAction";

export default function SchedulePage({
  schedule,
  monthDays,
  month,
  isView,
}: {
  schedule: SchedulesContextValue;
  monthDays: MonthDayType[];
  month?: string;
  isView: boolean;
}) {
  return (
    <Table className="table-fixed">
      <ScheduleTableHeader
        scheduleId={schedule?.id}
        monthDays={monthDays}
        month={month}
      />
      <ScheduleTableBody schedule={schedule} isView={isView} />
      <ScheduleTableFooter schedule={schedule} />
    </Table>
  );
}
