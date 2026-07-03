"use client";

import { YearData } from "@/app/actions/remarks/remarks-action";
import { GetTipsAddByYear } from "@/app/actions/tips-add/tips-add-actions";
import { useSearchParams } from "next/navigation";
import ChartRemarksPage from "./chart-remarks/chart-remarks-page";
import ChartTipsAddPage from "./chart-tips-add-page/chart-tips-add-page";

export default function ChartArchivePage({
  data,
}: {
  data: {
    dataRemarks: YearData[];
    dataTips: GetTipsAddByYear[];
  };
}) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  return (
    <>
      {tab === "penalty-year" && (
        <ChartRemarksPage dataRemarks={data.dataRemarks} />
      )}
      {(tab === "tips-month" || tab === "tips-year") && (
        <ChartTipsAddPage dataTipsAdd={data.dataTips} tab={tab} />
      )}
    </>
  );
}
