"use client";

import { BreakGetType } from "@/app/actions/break/break-action";
import { RemarksDataByUniqueKey } from "@/app/actions/remarks/remarks-action";
import { ReportDataByUniqueKey } from "@/app/actions/report-bar/report-bar-action";
import { ReportCucinaDataByUniqueKey } from "@/app/actions/report-cucina/report-cucina-action";
import { TipsAddData } from "@/app/actions/tips-add/tips-add-actions";
import ReportBarTable from "@/features/archive/bar/report-bar";
import ReportCucinaTable from "@/features/archive/cucina/report-cucina";
import { useHashParam } from "@/hooks/use-hash";
import { useAbility } from "@/providers/ability-provider";
import { BreakListArchive } from "./break/break-list-archive";
import PenaltyDetails from "./penalty-details/penalty-details";
import PenaltyGeneral from "./penalty-general/penalty-general";
import TipsData from "./tips/tips-data";

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

  const TABS = [
    {
      key: "bar",
      visible: !isCucina,
      render: () => <ReportBarTable data={archiveData.bar} />,
    },
    {
      key: "cucina",
      visible: !isBar,
      render: () => <ReportCucinaTable data={archiveData.cucina} />,
    },
    {
      key: "breakList",
      visible: !isCucina,
      render: () => <BreakListArchive data={archiveData.breakList} />,
    },
    {
      key: "penalty",
      visible: !isCucina,
      render: () => <PenaltyDetails data={archiveData.penalty} />,
    },
    {
      key: "penalty-result",
      visible: !isCucina && !isBar,
      render: () => <PenaltyGeneral data={archiveData.penalty} />,
    },
    {
      key: "tips-add",
      visible: !isCucina && !isBar,
      render: () => <TipsData data={archiveData.tips} />,
    },
  ];

  const activeTab = TABS.find((t) => t.key === tab && t.visible);

  return activeTab ? activeTab.render() : null;
}
