"use client";

import { GetBreakData } from "@/app/actions/break/break-action";

import { GetRemarksData } from "@/app/actions/remarks/remarks-action";
import { GetReportData } from "@/app/actions/report-bar/report-bar-action";
import { GetKitchenData } from "@/app/actions/report-kitchen/kitchen-action";
import { GetTipsAddData } from "@/app/actions/tips-add/tips-add-actions";
import ReportBarArchive from "@/features/archive/bar/report-bar-archive";
import ReportCucinaArchive from "@/features/archive/cucina/report-cucina-archive";
import { useAbility } from "@/providers/ability-provider";
import { useSearchParams } from "next/navigation";
import { BreakListArchive } from "./break/break-list-archive";
import PenaltyResult from "./penalty-result/penalty-result";
import PenaltyArchiveData from "./penalty/penalty-archive-data";
import TipsArchiveData from "./tips/tips-archive-data";

export type ArchiveData = {
  bar: GetReportData[] | null;
  cucina: GetKitchenData[] | null;
  breakList: GetBreakData[] | null;
  penalty: GetRemarksData[] | null;
  tips: GetTipsAddData[] | null;
};

export default function ArchivePage({
  archiveData,
}: {
  archiveData: ArchiveData;
}) {
  const { isBar, isCucina } = useAbility();

  const tab = useSearchParams().get("tab");

  const TABS = [
    {
      key: "bar",
      visible: !isCucina,
      render: () => <ReportBarArchive data={archiveData.bar} />,
    },
    {
      key: "cucina",
      visible: !isBar,
      render: () => <ReportCucinaArchive data={archiveData.cucina} />,
    },
    {
      key: "breakList",
      visible: !isCucina,
      render: () => <BreakListArchive data={archiveData.breakList} />,
    },
    {
      key: "penalty",
      visible: !isCucina,
      render: () => <PenaltyArchiveData data={archiveData.penalty} />,
    },
    {
      key: "penalty-result",
      visible: !isCucina && !isBar,
      render: () => <PenaltyResult data={archiveData.penalty} />,
    },
    {
      key: "tips-add",
      visible: !isCucina && !isBar,
      render: () => <TipsArchiveData data={archiveData.tips} />,
    },
  ];

  const activeTab = TABS.find((t) => t.key === tab && t.visible);

  return activeTab ? activeTab.render() : null;
}
