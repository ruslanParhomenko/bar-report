import { getRealtimeBreakList } from "@/app/actions/break/break-action";
import { getRealtimeRemarksList } from "@/app/actions/remarks/remarks-action";
import { getRealtimeReportBar } from "@/app/actions/report-bar/report-bar-action";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import BarForm from "@/features/report/bar/report-bar-form";
import { checkAccess } from "@/lib/check-access";

const SET_ACCESS = ["ADMIN", "BAR", "USER"];
export default async function Page() {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;

  const [realtimeDataReport, realtimeDataPenalty, realtimeDataBreak] =
    await Promise.all([
      getRealtimeReportBar(),
      getRealtimeRemarksList(),
      getRealtimeBreakList(),
    ]);

  return (
    <BarForm
      realtimeData={{
        report: realtimeDataReport ?? undefined,
        penalty: realtimeDataPenalty ?? undefined,
        breakForm: realtimeDataBreak ?? undefined,
      }}
    />
  );
}
