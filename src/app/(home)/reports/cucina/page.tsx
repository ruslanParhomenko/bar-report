import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import ReportCucinaForm from "@/features/report/cucina/ReportCucinaForm";
import { checkAccess } from "@/lib/check-access";
const SET_ACCESS = ["ADMIN", "CUCINA"];

export default async function Page() {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;
  return <ReportCucinaForm />;
}
