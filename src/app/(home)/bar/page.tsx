import { getRealtimeReportBar } from "@/app/actions/report-bar/report-bar-action";
import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import BarForm from "@/features/bar/bar-form";
import { BarFormValues } from "@/features/bar/schema";
import { checkAccess } from "@/lib/check-access";

const SET_ACCESS = ["ADMIN", "BAR", "USER"];

export default async function Page() {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;

  const realtimeData = await getRealtimeReportBar();

  return <BarForm realtimeData={realtimeData as BarFormValues} />;
}
