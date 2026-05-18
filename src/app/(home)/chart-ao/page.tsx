import { getAOByYear } from "@/app/actions/a-o/ao-action";
import ChartAOPage from "@/features/chart-ao/chart-ao-page";

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
