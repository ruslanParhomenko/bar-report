import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import PenaltyForm from "@/features/penalty/penalty-form";
import { checkAccess } from "@/lib/check-access";

const SET_ACCESS = ["ADMIN", "BAR"];

export default async function Page() {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;
  return <PenaltyForm />;
}
