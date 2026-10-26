import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { ADMIN, USER } from "@/constants/roles";
import ArchivePage from "@/features/archive/archive-page";
import { getBreakListByYearMonth } from "@/features/break/actions/get-break";
import { getReportCucinaByYearMonth } from "@/features/cucina/actions/get-report-cucina";
import { getRemarksByYearMonth } from "@/features/penalty/actions/get-penalty";
import { getReportBarByYearMonth } from "@/features/report-bar/actions/get-report-bar";
import { getTipsAddByYearMonth } from "@/features/tips-add/actions/get-tips-add";
import { authOptions } from "@/lib/auth";
import { MONTHS } from "@/utils/get-month-days";
import { getServerSession } from "next-auth";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;

  const { month, year } = params;
  if (!month || !year) return null;

  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === ADMIN;
  const isCCTV = session?.user?.role === USER;

  if (!isAdmin && !isCCTV) {
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

  const [dataReportBar, dataBreak, dataReportCucina, dataRemarks, tipsAdd] =
    await Promise.allSettled([
      getReportBarByYearMonth(year, month),
      getBreakListByYearMonth(year, month),
      getReportCucinaByYearMonth(year, month),
      getRemarksByYearMonth(year, month),
      getTipsAddByYearMonth(year, month),
    ]);
  return (
    <ArchivePage
      archiveData={{
        bar: dataReportBar.status === "fulfilled" ? dataReportBar.value : null,
        breakList: dataBreak.status === "fulfilled" ? dataBreak.value : null,
        cucina:
          dataReportCucina.status === "fulfilled"
            ? dataReportCucina.value
            : null,
        penalty: dataRemarks.status === "fulfilled" ? dataRemarks.value : null,
        tips: tipsAdd.status === "fulfilled" ? tipsAdd.value : null,
      }}
      isAdmin={isAdmin}
    />
  );
}
