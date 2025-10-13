import { getPenalty } from "@/app/actions/getPenalty";
import { PenaltyPage } from "@/features/penalty/PenaltyPage";

export const revalidate = 43200;
export const fetchCache = "force-cache";

export default async function Page() {
  const data = await getPenalty();
  return <PenaltyPage data={data.penalty} />;
}
