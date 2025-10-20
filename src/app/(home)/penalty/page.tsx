import { getRemarks } from "@/app/actions/remarks/getRemarks";
import { PenaltyPage } from "@/features/penalty/PenaltyPage";

// export const revalidate = 43200;
// export const fetchCache = "force-cache";

export default async function Page() {
  const remarks = await getRemarks();
  return <PenaltyPage data={remarks.remarks} />;
}
