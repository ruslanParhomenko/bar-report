"use client";

import { YearData } from "@/app/actions/remarks/remarks-action";
import { GetTipsAddByYear } from "@/app/actions/tips-add/tips-add-actions";
import { useSearchParams } from "next/navigation";
import ChartRemarksPage from "./chart-remarks/chart-remarks-page";
import ChartTipsAddPage from "./chart-tips-add-page/chart-tips-add-page";

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
