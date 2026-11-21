import { TABS_BY_ROUTE } from "@/components/home-layout/header-bar/constants";
import { CASH_MAIN_ROUTE } from "@/constants/route-tag";
import { CashMonthPage } from "@/features/cash-month";
import { getAOByYearAndMonth } from "@/features/finance/a-o/actions/get-ao";
import {
  getCashByYear,
  getCashByYearAndMonth,
} from "@/features/finance/cash/actions/get-cash";
import CashYearPage from "@/features/finance/cash/ui/year/cash-year-page";

type CashTabValue = (typeof TABS_BY_ROUTE)[typeof CASH_MAIN_ROUTE][number];
const CashTab = {
  MONTH: "cash-month",
  YEAR: "cash-year",
} as const satisfies Record<string, CashTabValue>;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year, tab } = await searchParams;

  if (!month || !year || !tab) return null;

  if (tab === CashTab.YEAR) {
    const dataCashYear = await getCashByYear(year);

    return <CashYearPage data={dataCashYear} />;
  }

  if (tab === CashTab.MONTH) {
    const dataAoByMonth = await getAOByYearAndMonth(year, month);
    const dataCashByMonth = await getCashByYearAndMonth(year, month);
    return (
      <CashMonthPage dataAo={dataAoByMonth} dataCashByMonth={dataCashByMonth} />
    );
  }

  return null;
}
