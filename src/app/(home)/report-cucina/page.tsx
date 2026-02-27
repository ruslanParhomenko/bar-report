import { getDataProducts } from "@/app/actions/data-products-prepare/data-products-action";
import { getRealtimeReportCucina } from "@/app/actions/report-cucina/report-cucina-action";
import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import ReportCucinaForm from "@/features/cucina/report-cucina-form";
import { checkAccess } from "@/lib/check-access";
const SET_ACCESS = ["ADMIN", "CUCINA", "USER"];

export default async function Page() {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;
  const [realtimeData, data] = await Promise.all([
    getRealtimeReportCucina(),
    getDataProducts(),
  ]);
  if (!realtimeData || !data) return null;

  return (
    <ReportCucinaForm realtimeData={realtimeData} dataProducts={data ?? []} />
  );
}
