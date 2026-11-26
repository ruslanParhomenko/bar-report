import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { ADMIN } from "@/constants/roles";
import { RESULT_MAIN_ROUTE } from "@/constants/route-tag";
import { remarksByUniqueEmployee } from "@/features/archive/penalty-archive/utils";
import { getRemarksByYearMonth } from "@/features/penalty/actions/get-penalty";
import { ResultPage } from "@/features/result";
import { getScheduleByYearAndMonth } from "@/features/schedule/schedule-edit/actions/get-schedule";
import { getTipsByYearAndMonth } from "@/features/tips-month/actions/get-tips";
import { requireTabAccess } from "@/lib/access";
import { canViewSchedule } from "@/utils/can-access-period";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year, tab } = await searchParams;

  if (!month || !year || !tab) return null;

  const { user } = await requireTabAccess(RESULT_MAIN_ROUTE, tab);

  if (!user) {
    return <InsufficientRights />;
  }

  const isAdmin = user?.role === ADMIN;

  if (!canViewSchedule(year, month, 1, 0) && !isAdmin) {
    return <InsufficientRights />;
  }

  const [schedules, remarks, tipsData] = await Promise.all([
    getScheduleByYearAndMonth(year, month),
    getRemarksByYearMonth(year, month),
    getTipsByYearAndMonth(year, month),
  ]);

  const remarksByEmployee =
    remarks && remarksByUniqueEmployee(remarks).formattedData;

  return (
    <ResultPage
      dataSchedules={schedules}
      dataRemarks={
        remarksByEmployee as ReturnType<
          typeof remarksByUniqueEmployee
        >["formattedData"]
      }
      tipsData={tipsData}
      month={month}
      year={year}
      isAdmin={isAdmin}
      tab={tab}
    />
  );
}
