"use client";
import type { GetRemarksYearData } from "@/features/penalty/model/type";
import type { GetTipsAddByYear } from "@/features/tips-add/model/type";
import { useSearchParams } from "next/navigation";
import ChartRemarksPage from "./chart-remarks/chart-remarks-page";
import ChartTipsAddPage from "./chart-tips-add-page/chart-tips-add-page";

const TIPS_TABS = ["tips-day", "tips-year", "tips-employee"] as const;
const PENALTY_TABS = ["penalty-year", "penalty-employee"] as const;

export default function ChartArchivePage({
  data,
}: {
  data: {
    dataRemarks: GetRemarksYearData[] | null;
    dataTips: GetTipsAddByYear[] | null;
  };
}) {
  const tab = useSearchParams().get("tab");

  if (
    tab &&
    PENALTY_TABS.includes(tab as (typeof PENALTY_TABS)[number]) &&
    data.dataRemarks
  ) {
    return <ChartRemarksPage dataRemarks={data.dataRemarks} tab={tab} />;
  }

  if (
    tab &&
    data.dataTips &&
    TIPS_TABS.includes(tab as (typeof TIPS_TABS)[number])
  ) {
    return <ChartTipsAddPage dataTipsAdd={data.dataTips} tab={tab} />;
  }

  return null;
}
