"use client";

import { YearData } from "@/app/actions/remarks/remarks-action";
import { GetTipsAddByYear } from "@/app/actions/tips-add/tips-add-actions";
import { useAbility } from "@/providers/ability-provider";
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

  const { isAdmin, isManager, isUser } = useAbility();
  const canSeeAll = isAdmin || isManager || isUser;

  return (
    <>
      {(tab === "penalty-month" || tab === "penalty-year") && (
        <ChartRemarksPage dataRemarks={data.dataRemarks} tab={tab} />
      )}
      {(tab === "tips-month" ||
        tab === "tips-year" ||
        tab === "tips-employees") &&
      canSeeAll ? (
        <ChartTipsAddPage dataTipsAdd={data.dataTips} tab={tab} />
      ) : (
        <div className="text-rd flex h-full items-center justify-center">
          no permissions
        </div>
      )}
    </>
  );
}
