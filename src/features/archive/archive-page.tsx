"use client";

import { Activity } from "react";
import { ReportDataByUniqueKey } from "@/app/actions/report-bar/report-bar-action";
import ReportBarTable from "@/features/archive/bar/report-bar";
import { ReportCucinaDataByUniqueKey } from "@/app/actions/report-cucina/report-cucina-action";
import ReportCucinaTable from "@/features/archive/cucina/report-cucina";
import { BreakGetType } from "@/app/actions/break/break-action";
import { BreakListArchive } from "./break/break-list-archive";
import { RemarksDataByUniqueKey } from "@/app/actions/remarks/remarks-action";
import PenaltyDetails from "./penalty-details/penalty-details";
import PenaltyGeneral from "./penalty-general/penalty-general";
import { useHashParam } from "@/hooks/use-hash";

type TabValue = "bar" | "cucina" | "breakList" | "penalty" | "penaltyResult";
export type ArchiveData = {
  bar: ReportDataByUniqueKey | null;
  cucina: ReportCucinaDataByUniqueKey | null;
  breakList: BreakGetType | null;
  penalty: RemarksDataByUniqueKey | null;
};
export default function ArchivePage({
  archiveData,
}: {
  archiveData: ArchiveData;
}) {
  const [tab] = useHashParam("tab");

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

      <Activity mode={tab === "penalty-result" ? "visible" : "hidden"}>
        <PenaltyGeneral data={archiveData.penalty} />
      </Activity>
    </>
  );
}
