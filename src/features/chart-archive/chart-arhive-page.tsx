"use client";

import { YearData } from "@/app/actions/remarks/remarks-action";
import { useSearchParams } from "next/navigation";
import ChartRemarksPage from "./chart-remarks/chart-remarks-page";

export default function ChartArchivePage({
  data,
}: {
  data: {
    dataRemarks: YearData[];
  };
}) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  return (
    <>
      {tab === "penalty" && <ChartRemarksPage dataRemarks={data.dataRemarks} />}
    </>
  );
}
