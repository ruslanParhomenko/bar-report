"use client";
import { useSearchParams } from "next/navigation";
import ChartRemarksPage from "./chart-remarks/chart-remarks-page";
import ChartTipsAddPage from "./chart-tips-add-page/chart-tips-add-page";
import { GetTipsAddByYear } from "@/features/staff/bar/tips-add/model/type";
import { YearData } from "@/features/staff/bar/penalty/model/type";

const TIPS_TABS = ["tips-day", "tips-year", "tips-employee"] as const;

export default function ChartArchivePage({
  data,
}: {
  data: {
    dataRemarks: YearData[];
    dataTips: GetTipsAddByYear[];
  };
}) {
  const tab = useSearchParams().get("tab");

  if (tab === "penalty-year") {
    return <ChartRemarksPage dataRemarks={data.dataRemarks} />;
  }

  if (tab && TIPS_TABS.includes(tab as (typeof TIPS_TABS)[number])) {
    return <ChartTipsAddPage dataTipsAdd={data.dataTips} tab={tab} />;
  }

  return null;
}
