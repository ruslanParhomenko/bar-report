"use client";

import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import ReportBarArchive from "@/features/archive/bar/report-bar-archive";
import { BreakListArchive } from "@/features/archive/break/break-list-archive";
import ReportCucinaArchive from "@/features/archive/cucina/report-cucina-archive";
import OrdersArchivePage from "@/features/archive/orders/orders-archive-page";
import PenaltyResult from "@/features/archive/penalty-result/penalty-result";
import PenaltyArchiveData from "@/features/archive/penalty/penalty-archive-data";
import TipsArchiveData from "@/features/archive/tips/tips-archive-data";
import { GetBreakData } from "@/features/break/model/type";
import { GetKitchenData } from "@/features/cucina/model/type";
import { GetRemarksData } from "@/features/penalty/model/type";
import { GetReportData } from "@/features/report-bar/model/type";
import { GetTipsAddData } from "@/features/tips-add/model/type";
import { useAccessCheck } from "@/hooks/use-tab-access";
import { useSearchParams } from "next/navigation";

interface ArchiveData {
  bar: GetReportData[] | null;
  cucina: GetKitchenData[] | null;
  breakList: GetBreakData[] | null;
  penalty: GetRemarksData[] | null;
  tips: GetTipsAddData[] | null;
}

interface ArchivePageProps {
  archiveData: ArchiveData;
  isAdmin: boolean;
}

export default function ArchivePage({
  archiveData,
  isAdmin,
}: ArchivePageProps) {
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
