import { getTipsByYear } from "@/app/actions/tips/tips-action";
import ChartTipsPage from "@/features/chart-tips/chart-tips-page";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { year } = await searchParams;
  if (!year) return null;

  const dataTipsYear = await getTipsByYear(year);

  return <ChartTipsPage dataTipsYear={dataTipsYear} />;
}
