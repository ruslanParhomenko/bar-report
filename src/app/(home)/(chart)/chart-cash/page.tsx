import { getCashByYear } from "@/features/cash-month/actions/get-cash";
import ChartCashPage from "@/features/chart/chart-cash/chart-cash-page";

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
