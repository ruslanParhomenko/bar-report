import { getAOByYearAndMonth } from "@/features/finance/a-o/actions/get-ao";
import { CashPage } from "@/features/finance/cash";
import { getCashByYear } from "@/features/finance/cash/actions/get-cash";

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
