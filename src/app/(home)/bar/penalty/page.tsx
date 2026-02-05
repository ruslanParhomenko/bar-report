import { getRealtimeRemarksList } from "@/app/actions/remarks/remarks-action";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import PenaltyForm from "@/features/penalty/penalty-form";
import { checkAccess } from "@/lib/check-access";

const SET_ACCESS = ["ADMIN", "BAR", "USER"];

export default async function Page() {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;
  const realtimeData = (await getRealtimeRemarksList()) ?? undefined;

  return <PenaltyForm realtimeData={realtimeData} />;
}
