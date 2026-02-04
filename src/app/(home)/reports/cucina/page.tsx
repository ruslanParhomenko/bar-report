import { getRealtimeReportCucina } from "@/app/actions/report-cucina/report-cucina-action";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import ReportCucinaForm from "@/features/report/cucina/report-cucina-form";
import { checkAccess } from "@/lib/check-access";
const SET_ACCESS = ["ADMIN", "CUCINA", "USER"];

export default async function Page() {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;
  const realtimeData = (await getRealtimeReportCucina()) ?? undefined;
  return <ReportCucinaForm realtimeData={realtimeData} />;
}
