import { getTodayUSDRateBNM } from "@/app/actions/currency/currency-actions";
import { getDataBreakList } from "@/app/actions/data-constants/data-break-action";
import { getRealtimeReportBar } from "@/app/actions/report-bar/report-bar-action";
import BarForm from "@/features/bar/bar-form";
import { BreakFormData } from "@/features/bar/break-form/schema";
import { BarFormValues } from "@/features/bar/schema";

export default async function Page() {
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
