import { AlgorithmPage } from "@/features/algorithm";
import { getAlgorithmData } from "@/features/algorithm/actions/get-algorithm";

export default async function Page() {
  const data = await getAlgorithmData();
  return <AlgorithmPage data={data} />;
}
