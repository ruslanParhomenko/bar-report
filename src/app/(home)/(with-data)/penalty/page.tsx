import { getRemarks, RemarksData } from "@/app/actions/remarks/remarksAction";
import { PenaltyPage } from "@/features/penalty/PenaltyPage";

export default async function Page() {
  const remarks = (await getRemarks()) as RemarksData;
  return <PenaltyPage data={remarks.remarks} />;
}
