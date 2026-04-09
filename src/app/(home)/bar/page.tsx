import { getTodayUSDRateBNM } from "@/app/actions/currency/currency-actions";
import { getDataBreakList } from "@/app/actions/data-constants/data-break-action";
import { getRealtimeReportBar } from "@/app/actions/report-bar/report-bar-action";

import BarForm from "@/features/bar/bar-form";
import { checkAccess } from "@/lib/check-access";
import { InsufficientRights } from "@/components/wrapper/insufficient-rights";

export default async function Page() {
  const hasAccess = await checkAccess("bar");
  if (!hasAccess) return <InsufficientRights />;

  const [realtimeData, dataBreakList, currencyUSD] = await Promise.all([
    getRealtimeReportBar(),
    getDataBreakList(),
    getTodayUSDRateBNM().catch(() => null),
  ]);

  return (
    <BarForm
      realtimeData={realtimeData}
      dataBreakList={dataBreakList}
      currencyUSD={currencyUSD ?? 0}
    />
  );
}
