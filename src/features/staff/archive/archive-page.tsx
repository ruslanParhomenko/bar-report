"use client";

import { useAbility } from "@/providers/ability-provider";
import { useSearchParams } from "next/navigation";
import { GetBreakData } from "../bar/break/model/type";
import { GetRemarksData } from "../bar/penalty/model/type";
import { GetReportData } from "../bar/report/model/type";
import ReportBarArchive from "./bar/report-bar-archive";
import { BreakListArchive } from "./break/break-list-archive";
import ReportCucinaArchive from "./cucina/report-cucina-archive";
import OrdersArchivePage from "./orders/orders-archive-page";
import PenaltyResult from "./penalty-result/penalty-result";
import PenaltyArchiveData from "./penalty/penalty-archive-data";
import TipsArchiveData from "./tips/tips-archive-data";

import { GetTipsAddData } from "../bar/tips-add/model/type";
import { GetKitchenData } from "../cucina/model/type";

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
      visible: true,
      render: () => <PenaltyResult data={archiveData.penalty} />,
    },
    {
      key: "tips-add",
      visible: !isCucina && !isBar,
      render: () => <TipsArchiveData data={archiveData.tips} />,
    },
    {
      key: "orders",
      visible: true,
      render: () => <OrdersArchivePage />,
    },
  ];

  const activeTab = TABS.find((t) => t.key === tab && t.visible);

  return activeTab ? activeTab.render() : null;
}
