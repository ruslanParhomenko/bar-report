import { getRealtimeBreakList } from "@/app/actions/break/break-action";

import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import BreakForm from "@/features/break/break-form";
import { checkAccess } from "@/lib/check-access";

const SET_ACCESS = ["ADMIN", "BAR", "USER"];

export default async function Page() {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;

  const realtimeData = (await getRealtimeBreakList()) ?? undefined;
  return <BreakForm defaultValues={realtimeData} />;
}
