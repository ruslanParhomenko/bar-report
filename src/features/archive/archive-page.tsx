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
import { TipsAddData } from "@/app/actions/tips-add/tips-add-actions";
import TipsData from "./tips/tips-data";
import { useAbility } from "@/providers/ability-provider";

type TabValue = "bar" | "cucina" | "breakList" | "penalty" | "penaltyResult";
export type ArchiveData = {
  bar: ReportDataByUniqueKey | null;
  cucina: ReportCucinaDataByUniqueKey | null;
  breakList: BreakGetType | null;
  penalty: RemarksDataByUniqueKey | null;
  tips: TipsAddData[] | null;
};
export default function ArchivePage({
  archiveData,
}: {
  archiveData: ArchiveData;
}) {
  const [tab] = useHashParam("tab");

  const { isBar, isCucina } = useAbility();

  return (
    <>
      <Activity mode={tab === "bar" && !isCucina ? "visible" : "hidden"}>
        <ReportBarTable data={archiveData.bar} />
      </Activity>

      <Activity mode={tab === "cucina" && !isBar ? "visible" : "hidden"}>
        <ReportCucinaTable data={archiveData.cucina} />
      </Activity>

      <Activity mode={tab === "breakList" && !isCucina ? "visible" : "hidden"}>
        <BreakListArchive data={archiveData.breakList} />
      </Activity>

      <Activity mode={tab === "penalty" && !isCucina ? "visible" : "hidden"}>
        <PenaltyDetails data={archiveData.penalty} />
      </Activity>

      <Activity
        mode={
          tab === "penalty-result" && !isCucina && !isBar ? "visible" : "hidden"
        }
      >
        <PenaltyGeneral data={archiveData.penalty} />
      </Activity>
      <Activity
        mode={tab === "tips-add" && !isCucina && !isBar ? "visible" : "hidden"}
      >
        <TipsData data={archiveData.tips} />
      </Activity>
    </>
  );
}
