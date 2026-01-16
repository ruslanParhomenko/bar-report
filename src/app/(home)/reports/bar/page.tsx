import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import ReportBarForm from "@/features/report/bar/ReportBarForm";
import { checkAccess } from "@/lib/check-access";

const SET_ACCESS = ["ADMIN", "BAR"];
export default async function Page() {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;
  return <ReportBarForm />;
}
