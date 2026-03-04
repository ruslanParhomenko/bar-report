import { getRealtimeReportBar } from "@/app/actions/report-bar/report-bar-action";
import BarForm from "@/features/bar/bar-form";
import { BarFormValues } from "@/features/bar/schema";

export default async function Page() {
  const realtimeData = await getRealtimeReportBar();

  return <BarForm realtimeData={realtimeData as BarFormValues} />;
}
