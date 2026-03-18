import { Table } from "@/components/ui/table";
import ScheduleTableFooter from "./schedule-footer";
import ScheduleTableHeader from "./schedule-header";
import ScheduleTableBody from "./schedule-body";
import { SchedulesContextValue } from "@/app/actions/schedule/schedule-action";

export default function SchedulePage({
  schedule,
  month,
  year,
}: {
  schedule: SchedulesContextValue | null;
  month: string;
  year: string;
}) {
  return (
    <Table className="table-fixed">
      <ScheduleTableHeader
        scheduleId={schedule?.id}
        month={month}
        year={year}
      />
      <ScheduleTableBody schedule={schedule} />
      <ScheduleTableFooter schedule={schedule} />
    </Table>
  );
}
