import { getTodayUSDRateBNM } from "@/app/actions/currency/currency-actions";
import { getDataBreakList } from "@/app/actions/data-constants/data-break-action";

import BarPage from "@/features/bar/bar-page";

export default async function Page() {
  const [dataBreakList, currencyUSD] = await Promise.all([
    getDataBreakList(),
    getTodayUSDRateBNM().catch(() => null),
  ]);

  return (
    <BarPage dataBreakList={dataBreakList} currencyUSD={currencyUSD ?? 0} />
  );
}
