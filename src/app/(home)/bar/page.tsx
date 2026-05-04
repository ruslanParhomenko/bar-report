import { getTodayUSDRateBNM } from "@/app/actions/currency/currency-actions";
import { getDataBreakList } from "@/app/actions/data-constants/data-break-action";
import { getRealtimeReportBar } from "@/app/actions/report-bar/report-bar-action";

import { ProtectedPage } from "@/components/wrapper/protected-page";
import BarPage from "@/features/bar/bar-page";

export default async function Page() {
  const [realtimeData, dataBreakList, currencyUSD] = await Promise.all([
    getRealtimeReportBar(),
    getDataBreakList(),
    getTodayUSDRateBNM().catch(() => null),
  ]);

  return (
    <ProtectedPage route={"bar"}>
      <BarPage
        realtimeData={realtimeData}
        dataBreakList={dataBreakList}
        currencyUSD={currencyUSD ?? 0}
      />
    </ProtectedPage>
  );
}
