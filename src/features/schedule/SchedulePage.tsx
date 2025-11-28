import { Table } from "@/components/ui/table";
import { SchedulesContextValue } from "@/providers/ScheduleProvider";
import ScheduleTableFooter from "./ScheduleTableFooter";
import ScheduleTableHeader from "./ScheduleTableHeader";
import { MonthDayType } from "@/utils/getMonthDays";
import ScheduleTableBody from "./ScheduleTableBody";

export default function SchedulePage({
  schedule,
  monthDays,
  month,
  patch,
  isView,
}: {
  schedule: SchedulesContextValue;
  monthDays: MonthDayType[];
  month?: string;
  patch: string;
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
