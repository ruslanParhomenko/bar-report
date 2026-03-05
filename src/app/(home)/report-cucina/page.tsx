import { getDataProducts } from "@/app/actions/data-constants/data-products-action";
import { getRealtimeReportCucina } from "@/app/actions/report-cucina/report-cucina-action";
import ReportCucinaForm from "@/features/cucina/report-cucina-form";

export default async function Page() {
  const [realtimeData, data] = await Promise.all([
    getRealtimeReportCucina(),
    getDataProducts(),
  ]);
  if (!realtimeData || !data) return null;

  return (
    <ReportCucinaForm realtimeData={realtimeData} dataProducts={data ?? []} />
  );
}
