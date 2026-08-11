import { getTodayUSDRateBNM } from "@/app/actions/currency/currency-actions";
import { getDataBreakList } from "@/features/settings/setting/actions/get-data-json";
import { BarPage } from "@/features/staff/bar";

export default async function Page() {
  const [dataBreakList, currencyUSD] = await Promise.all([
    getDataBreakList(),
    getTodayUSDRateBNM().catch(() => null),
  ]);

  return (
    <BarPage dataBreakList={dataBreakList} currencyUSD={currencyUSD ?? 0} />
  );
}
