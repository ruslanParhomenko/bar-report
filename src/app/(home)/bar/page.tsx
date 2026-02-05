import { getRealtimeReportBar } from "@/app/actions/report-bar/report-bar-action";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import ReportBarForm from "@/features/report/bar/report-bar-form";
import { checkAccess } from "@/lib/check-access";

const SET_ACCESS = ["ADMIN", "BAR", "USER"];
export default async function Page() {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;
  const realtimeData = (await getRealtimeReportBar()) ?? undefined;
  return <ReportBarForm realtimeData={realtimeData} />;
}
