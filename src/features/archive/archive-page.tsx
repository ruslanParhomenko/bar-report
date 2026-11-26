import { ReportBarArchivePage } from "@/features/archive/bar";
import { BreakArchivePage } from "@/features/archive/break-archive";
import ReportCucinaArchive from "@/features/archive/cucina/report-cucina-archive";
import OrdersArchivePage from "@/features/archive/orders/orders-archive-page";
import { PenaltyArchivePage } from "@/features/archive/penalty-archive";
import { TipsArchivePage } from "@/features/archive/tips-archive";
import { getBreakListByYearMonth } from "@/features/break/actions/get-break";
import { getReportCucinaByYearMonth } from "@/features/cucina/actions/get-report-cucina";
import { getRemarksByYearMonth } from "@/features/penalty/actions/get-penalty";
import { getReportBarByYearMonth } from "@/features/report-bar/actions/get-report-bar";
import { getTipsAddByYearMonth } from "@/features/tips-add/actions/get-tips-add";

interface ArchivePageProps {
  isAdmin: boolean;
  tab: string;
  year: string;
  month: string;
}

export default async function ArchivePage({
  isAdmin,
  tab,
  year,
  month,
}: ArchivePageProps) {
  if (tab === "bar") {
    const data = await getReportBarByYearMonth(year, month);
    return <ReportBarArchivePage data={data ?? null} />;
  }

  if (tab === "cucina") {
    const data = await getReportCucinaByYearMonth(year, month);
    return <ReportCucinaArchive data={data ?? null} />;
  }

  if (tab === "breakList") {
    const data = await getBreakListByYearMonth(year, month);
    return <BreakArchivePage data={data ?? null} />;
  }

  if (tab === "penalty") {
    const data = await getRemarksByYearMonth(year, month);
    return <PenaltyArchivePage data={data ?? null} isAdmin={isAdmin} />;
  }

  if (tab === "tips-add") {
    const data = await getTipsAddByYearMonth(year, month);
    return <TipsArchivePage data={data ?? null} isAdmin={isAdmin} />;
  }

  if (tab === "orders") {
    return <OrdersArchivePage />;
  }

  return null;
}
