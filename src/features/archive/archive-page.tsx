"use client";

import { Activity } from "react";
import { ReportDataByUniqueKey } from "@/app/actions/report-bar/report-bar-action";
import ReportBarTable from "@/components/table/report-bar-table/ReportBarTable";
import { ReportCucinaDataByUniqueKey } from "@/app/actions/report-cucina/report-cucina-action";
import ReportCucinaTable from "@/components/table/report-cucina-table/ReportCucinaTable";
import { BreakGetType } from "@/app/actions/break/break-action";
import { BreakListArchive } from "../break/break-list-archive";
import { RemarksDataByUniqueKey } from "@/app/actions/remarks/remarks-action";
import PenaltyDetails from "../penalty/penalty-details";
import PenaltyGeneral from "../penalty/penalty-general";
import { useSearchParams } from "next/navigation";

type TabValue = "bar" | "cucina" | "breakList" | "penalty" | "penaltyResult";
export type ArchiveData = {
  bar: ReportDataByUniqueKey | null;
  cucina: ReportCucinaDataByUniqueKey | null;
  breakList: BreakGetType | null;
  penalty: RemarksDataByUniqueKey | null;
  penaltyResult: RemarksDataByUniqueKey | null;
};
export default function ArchivePage({
  archiveData,
}: {
  archiveData: ArchiveData;
}) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") as TabValue;

  return (
    <>
      <Activity mode={tab === "bar" ? "visible" : "hidden"}>
        <ReportBarTable data={archiveData.bar} />
      </Activity>

      <Activity mode={tab === "cucina" ? "visible" : "hidden"}>
        <ReportCucinaTable data={archiveData.cucina} />
      </Activity>

      <Activity mode={tab === "breakList" ? "visible" : "hidden"}>
        <BreakListArchive data={archiveData.breakList} />
      </Activity>

      <Activity mode={tab === "penalty" ? "visible" : "hidden"}>
        <PenaltyDetails data={archiveData.penalty} />
      </Activity>

      <Activity mode={tab === "penaltyResult" ? "visible" : "hidden"}>
        <PenaltyGeneral data={archiveData.penaltyResult} />
      </Activity>
    </>
  );
}
