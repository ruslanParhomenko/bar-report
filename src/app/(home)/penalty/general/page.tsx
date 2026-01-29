import {
  getRemarksByUniqueKey,
  RemarksDataByUniqueKey,
} from "@/app/actions/remarks/remarks-action";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import PenaltyGeneral from "@/features/penalty/penalty-general";
import { checkAccess } from "@/lib/check-access";

const SET_ACCESS = ["ADMIN", "BAR", "MNGR", "USER"];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;

  const { month, year } = await searchParams;
  if (!month || !year) return null;
  const uniqueKey = `${year}-${month}`;

  const remarks = (await getRemarksByUniqueKey(
    uniqueKey,
  )) as RemarksDataByUniqueKey;

  return <PenaltyGeneral data={remarks} />;
}
