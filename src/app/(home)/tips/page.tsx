import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { ADMIN, USER } from "@/constants/roles";
import { TIPS_MAIN_ROUTE } from "@/constants/route-tag";
import { getTipsAddByYearMonth } from "@/features/chart/chart-archive/chart-tips-add-day/actions/get-tips-add-by-month";
import { getEmployees } from "@/features/settings/create-employee/actions/get-employees";
import { TipsMonthPage } from "@/features/tips-month";
import { getTipsByYearAndMonth } from "@/features/tips-month/actions/get-tips";
import { TipsYearPage } from "@/features/tips-year";
import { getTipsByYear } from "@/features/tips-year/actions/get-tips-year";
import { requireTabAccess } from "@/lib/access";
import { canViewSchedule } from "@/utils/can-access-period";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { year, month, tab } = await searchParams;
  if (!year || !month || !tab) return null;

  const { user } = await requireTabAccess(TIPS_MAIN_ROUTE, tab);

  if (!user) {
    return <InsufficientRights />;
  }
  const isAdmin = user.role === ADMIN;
  const isCCTV = user.role === USER;

  const prevMonths = isCCTV ? 1 : 0;

  if (!canViewSchedule(year, month, prevMonths, 0) && !isAdmin) {
    return <InsufficientRights />;
  }

  if (tab === "tips-year") {
    const dataTipsYear = await getTipsByYear(year);
    return <TipsYearPage dataTipsYear={dataTipsYear} />;
  }

  if (tab === "tips-month") {
    const [dataTipsMonth, employees, dataTipsAddMonth] = await Promise.all([
      getTipsByYearAndMonth(year, month),
      getEmployees(),
      getTipsAddByYearMonth(year, month),
    ]);
    return (
      <TipsMonthPage
        employees={employees}
        dataTipsMonth={dataTipsMonth}
        dataTipsAddMonth={dataTipsAddMonth}
      />
    );
  }

  return null;
}
