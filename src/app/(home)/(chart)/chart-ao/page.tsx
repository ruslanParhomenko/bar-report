import ChartAOPage from "@/features/chart/chart-ao/chart-ao-page";
import { getAOByYear } from "@/features/finance/a-o/actions/get-ao";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { year } = await searchParams;
  if (!year) return null;

  const dataAOYear = await getAOByYear(year);

  return <ChartAOPage dataAOYear={dataAOYear} />;
}
