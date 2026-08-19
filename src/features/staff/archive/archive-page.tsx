"use client";

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

import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { useAccessCheck } from "@/hooks/use-tab-access";
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
  isAdmin,
}: {
  archiveData: ArchiveData;
  isAdmin: boolean;
}) {
  const hasAccess = useAccessCheck();
  const tab = useSearchParams().get("tab");

  const TABS = [
    {
      key: "bar",
      render: () => <ReportBarArchive data={archiveData.bar} />,
    },
    {
      key: "cucina",
      render: () => <ReportCucinaArchive data={archiveData.cucina} />,
    },
    {
      key: "breakList",
      render: () => <BreakListArchive data={archiveData.breakList} />,
    },
    {
      key: "penalty",
      render: () => (
        <PenaltyArchiveData data={archiveData.penalty} isAdmin={isAdmin} />
      ),
    },
    {
      key: "penalty-result",
      render: () => <PenaltyResult data={archiveData.penalty} />,
    },
    {
      key: "tips-add",
      render: () => <TipsArchiveData data={archiveData.tips} />,
    },
    {
      key: "orders",
      render: () => <OrdersArchivePage />,
    },
  ];

  const activeTab = TABS.find((t) => t.key === tab);

  if (!hasAccess) return <InsufficientRights />;

  return activeTab ? activeTab.render() : null;
}
