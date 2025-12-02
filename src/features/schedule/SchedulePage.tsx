import { Table } from "@/components/ui/table";
import ScheduleTableFooter from "./ScheduleTableFooter";
import ScheduleTableHeader from "./ScheduleTableHeader";
import { MonthDayType } from "@/utils/getMonthDays";
import ScheduleTableBody from "./ScheduleTableBody";
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
