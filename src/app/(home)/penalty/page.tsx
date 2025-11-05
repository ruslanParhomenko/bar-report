import { getRemarks } from "@/app/actions/remarks/getRemarks";
import { PenaltyPage } from "@/features/penalty/PenaltyPage";

export default async function Page() {
  const remarks = await getRemarks();
  return <PenaltyPage data={remarks.remarks} />;
}
