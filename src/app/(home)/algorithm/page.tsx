import { AlgorithmPage } from "@/features/algorithm";
import { getAlgorithmData } from "@/features/algorithm/actions/get-algorithm";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { tab } = await searchParams;
  if (!tab) return null;
  const data = await getAlgorithmData();
  return <AlgorithmPage data={data} tab={tab} />;
}
