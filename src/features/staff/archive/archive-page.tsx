"use client";

import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { GetBreakData } from "@/features/break/model/type";
import { GetRemarksData } from "@/features/penalty/model/type";
import { GetReportData } from "@/features/report-bar/model/type";
import ReportBarArchive from "@/features/staff/archive/bar/report-bar-archive";
import { BreakListArchive } from "@/features/staff/archive/break/break-list-archive";
import ReportCucinaArchive from "@/features/staff/archive/cucina/report-cucina-archive";
import OrdersArchivePage from "@/features/staff/archive/orders/orders-archive-page";
import PenaltyResult from "@/features/staff/archive/penalty-result/penalty-result";
import PenaltyArchiveData from "@/features/staff/archive/penalty/penalty-archive-data";
import TipsArchiveData from "@/features/staff/archive/tips/tips-archive-data";
import { GetKitchenData } from "@/features/staff/cucina/model/type";
import { GetTipsAddData } from "@/features/tips-add/model/type";
import { useAccessCheck } from "@/hooks/use-tab-access";
import { useSearchParams } from "next/navigation";

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
