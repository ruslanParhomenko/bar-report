import { AlgorithmPage } from "@/features/staff/algorithm";
import { getAlgorithmData } from "@/features/staff/algorithm/actions/get-algorithm";

export default async function Page() {
  const data = await getAlgorithmData();
  return <AlgorithmPage data={data} />;
}
