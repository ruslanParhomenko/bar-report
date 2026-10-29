import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { ADMIN } from "@/constants/roles";
import { remarksByUniqueEmployee } from "@/features/archive/penalty-archive/utils";
import { getRemarksByYearMonth } from "@/features/penalty/actions/get-penalty";
import { ResultPage } from "@/features/result";
import { getScheduleByYearAndMonth } from "@/features/schedule/schedule-edit/actions/get-schedule";
import { getTipsByYearAndMonth } from "@/features/staff/tips/actions/get-tips";
import { authOptions } from "@/lib/auth";
import { MONTHS } from "@/utils/get-month-days";
import { getServerSession } from "next-auth";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year } = await searchParams;

  if (!month || !year) return null;

  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === ADMIN;

  if (!isAdmin) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const requestedYear = parseInt(year);
    const requestedMonth = MONTHS.indexOf(month) + 1;

    const isCurrentYearOrNext =
      requestedYear === currentYear &&
      (requestedMonth === currentMonth || requestedMonth === currentMonth + 1);

    if (!isCurrentYearOrNext) {
      return <InsufficientRights />;
    }
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
    />
  );
}
