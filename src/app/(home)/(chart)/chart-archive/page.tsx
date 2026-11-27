import ChartRemarksPage from "@/features/chart/chart-archive/chart-remarks/chart-remarks-page";
import ChartTipsAddPage from "@/features/chart/chart-archive/chart-tips-add-page/chart-tips-add-page";
import { getRemarksByYear } from "@/features/penalty/actions/get-penalty";
import { getTipsAddByYear } from "@/features/tips-add/actions/get-tips-add";

const TIPS_TABS = ["tips-day", "tips-year", "tips-employee"] as const;
const PENALTY_TABS = ["penalty-year", "penalty-employee"] as const;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year, tab } = await searchParams;
  if (!month || !year || !tab) return null;

  if (PENALTY_TABS.includes(tab as (typeof PENALTY_TABS)[number])) {
    const dataRemarks = await getRemarksByYear(year);
    return <ChartRemarksPage dataRemarks={dataRemarks} tab={tab} />;
  }

  if (TIPS_TABS.includes(tab as (typeof TIPS_TABS)[number])) {
    const dataTipsAdd = await getTipsAddByYear(year);
    return <ChartTipsAddPage dataTipsAdd={dataTipsAdd} tab={tab} />;
  }

  return null;
}
