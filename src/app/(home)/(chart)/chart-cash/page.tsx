import ChartCashPage from "@/features/chart/chart-cash/chart-cash-page";
import { getCashByYear } from "@/features/finance/cash/actions/get-cash";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { year } = await searchParams;
  if (!year) return null;

  const dataCashYear = await getCashByYear(year);

  return <ChartCashPage dataCashYear={dataCashYear} />;
}
