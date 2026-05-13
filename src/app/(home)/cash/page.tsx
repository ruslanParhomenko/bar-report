import { getAOByYearAndMonth } from "@/app/actions/a-o/ao-action";
import { getCashByYear } from "@/app/actions/cash/cash-action";
import CashPage from "@/features/cash/cash-page";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year } = await searchParams;

  if (!month || !year) return null;

  const [dataCashYear, dataAo] = await Promise.all([
    getCashByYear(year),
    getAOByYearAndMonth(year, month),
  ]);

  return <CashPage dataAo={dataAo} dataCashYear={dataCashYear} />;
}
