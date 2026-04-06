import { getTodayUSDRateBNM } from "@/app/actions/currency/currency-actions";
import { getDataBreakList } from "@/app/actions/data-constants/data-break-action";
import { getRealtimeReportBar } from "@/app/actions/report-bar/report-bar-action";
import { SIDEBAR_NAVIGATION } from "@/constants/sidebar-nav";
import BarForm from "@/features/bar/bar-form";
import { BreakFormData } from "@/features/bar/break-form/schema";
import { BarFormValues } from "@/features/bar/schema";

const SET_ACCESS =
  SIDEBAR_NAVIGATION.find((item) => item.title === "bar")?.setAcces || [];

import { checkAccess } from "@/lib/check-access";
import { InsufficientRights } from "@/components/wrapper/insufficient-rights";

export default async function Page() {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;
  const [realtimeData, dataBreakList, currencyUSD] = await Promise.all([
    await getRealtimeReportBar(),
    await getDataBreakList(),
    await getTodayUSDRateBNM(),
  ]);

  return (
    <BarForm
      realtimeData={realtimeData as BarFormValues}
      dataBreakList={dataBreakList as BreakFormData}
      currencyUSD={currencyUSD}
    />
  );
}
