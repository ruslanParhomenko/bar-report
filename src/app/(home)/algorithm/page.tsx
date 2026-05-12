import AlgorithmPage from "@/features/algorithm/algorithm-page";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { tab } = await searchParams;
  return <AlgorithmPage tab={tab} />;
}
