import { getBreakListByYearMonth } from "@/features/break/actions/get-break";
import { getRemarksByYearMonth } from "@/features/penalty/actions/get-penalty";
import { getReportBarByYearMonth } from "@/features/report-bar/actions/get-report-bar";
import { getScheduleByYearAndMonth } from "@/features/schedule/schedule-edit/actions/get-schedule";
import ArchivePage, {
  ArchiveData,
} from "@/features/staff/archive/archive-page";

import { getReportCucinaByYearMonth } from "@/features/staff/cucina/actions/get-report-cucina";
import { getTipsAddByYearMonth } from "@/features/tips-add/actions/get-tips-add";
import { headers } from "next/headers";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;

  const { month, year } = params;
  const headerStore = await headers();
  const isAdmin = headerStore.get("x-is-admin") === "true";
  if (!month || !year) return null;

  const [
    dataReportBar,
    dataBreak,
    dataReportCucina,
    dataRemarks,
    tipsAdd,
    dataScheduleBarByMonth,
  ] = await Promise.allSettled([
    getReportBarByYearMonth(year, month),
    getBreakListByYearMonth(year, month),
    getReportCucinaByYearMonth(year, month),
    getRemarksByYearMonth(year, month),
    getTipsAddByYearMonth(year, month),
    getScheduleByYearAndMonth(year, month),
  ]);
  return (
    <ArchivePage
      archiveData={
        {
          bar:
            dataReportBar.status === "fulfilled" ? dataReportBar.value : null,
          breakList: dataBreak.status === "fulfilled" ? dataBreak.value : null,
          cucina:
            dataReportCucina.status === "fulfilled"
              ? dataReportCucina.value
              : null,
          penalty:
            dataRemarks.status === "fulfilled" ? dataRemarks.value : null,
          tips: tipsAdd.status === "fulfilled" ? tipsAdd.value : null,
          schedule:
            dataScheduleBarByMonth.status === "fulfilled"
              ? dataScheduleBarByMonth.value?.filter(
                  (item) => item.id === "bar",
                )?.[0]
              : null,
        } as ArchiveData
      }
      isAdmin={isAdmin}
    />
  );
}
