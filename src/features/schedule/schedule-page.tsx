import { Table } from "@/components/ui/table";
import ScheduleTableFooter from "./schedule-footer";
import ScheduleTableHeader from "./schedule-header";
import ScheduleTableBody from "./schedule-body";
import { SchedulesContextValue } from "@/app/actions/schedule/schedule-action";
import { PageParams } from "@/types/params";

export default function SchedulePage({
  schedule,
  params,
}: {
  schedule: SchedulesContextValue | null;
  params: PageParams;
}) {
  return (
    <Table className="table-fixed">
      <ScheduleTableHeader scheduleId={schedule?.id} params={params} />
      <ScheduleTableBody schedule={schedule} />
      <ScheduleTableFooter
        schedule={schedule?.rowShifts ?? []}
        role={params.tab as string}
      />
    </Table>
  );
}
