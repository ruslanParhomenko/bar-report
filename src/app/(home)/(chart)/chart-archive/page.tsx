import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { ADMIN } from "@/constants/roles";
import { CHART_ARCHIVE_ROUTE } from "@/constants/route-tag";
import ChartRemarksPage from "@/features/chart/chart-archive/chart-remarks/chart-remarks-page";
import { ChartArchiveTipsAddDay } from "@/features/chart/chart-archive/chart-tips-add-day";
import { getTipsAddByYearMonth } from "@/features/chart/chart-archive/chart-tips-add-day/actions/get-tips-add-by-month";
import { getTipsAddYearEmployee } from "@/features/chart/chart-archive/chart-tips-add-employee/actions/get-tips-add-year-employee";
import ChartTipsAddEmployee from "@/features/chart/chart-archive/chart-tips-add-employee/ui/chart-tips-add-employee";
import ChartTipsAddYear from "@/features/chart/chart-archive/chart-tips-add-page/ui/chart-tips-add-page";
import { getRemarksByYear } from "@/features/penalty/actions/get-penalty";
import { requireTabAccess } from "@/lib/access";
import { canViewSchedule } from "@/utils/can-access-period";

const PENALTY_TABS = ["penalty-year", "penalty-employee"] as const;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year, tab } = await searchParams;
  if (!month || !year || !tab) return null;

  const { user } = await requireTabAccess(CHART_ARCHIVE_ROUTE, tab);

  if (!user) {
    return <InsufficientRights />;
  }

  const isAdmin = user?.role === ADMIN;

  if (!canViewSchedule(year, month, 1, 0) && !isAdmin) {
    return <InsufficientRights />;
  }

  if (PENALTY_TABS.includes(tab as (typeof PENALTY_TABS)[number])) {
    const dataRemarks = await getRemarksByYear(year);
    return <ChartRemarksPage dataRemarks={dataRemarks} tab={tab} />;
  }

  if (tab === "tips-year") {
    const dataTipsAdd = await getTipsAddYearEmployee(year);
    return <ChartTipsAddYear dataTipsAddYear={dataTipsAdd} />;
  }

  if (tab === "tips-day") {
    const dataTipsAddMonth = await getTipsAddByYearMonth(year, month);
    return <ChartArchiveTipsAddDay dataTipsAddMonth={dataTipsAddMonth} />;
  }

  if (tab === "tips-employee") {
    const dataTipsAddYear = await getTipsAddYearEmployee(year);
    return <ChartTipsAddEmployee dataTipsAddYear={dataTipsAddYear} />;
  }

  return null;
}
