import { getCashByYear } from "@/app/actions/cash/cash-action";
import ChartCashPage from "@/features/chart-cash/chart-cash-page";

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
