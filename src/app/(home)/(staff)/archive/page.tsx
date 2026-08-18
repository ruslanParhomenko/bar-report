import ArchivePage, {
  ArchiveData,
} from "@/features/staff/archive/archive-page";
import { getBreakListByYearMonth } from "@/features/staff/bar/break/actions/get-break";
import { getRemarksByYearMonth } from "@/features/staff/bar/penalty/actions/get-penalty";
import { getReportBarByYearMonth } from "@/features/staff/bar/report/actions/get-report-bar";
import { getTipsAddByYearMonth } from "@/features/staff/bar/tips-add/actions/get-tips-add";
import { getReportCucinaByYearMonth } from "@/features/staff/cucina/actions/get-report-cucina";
import { headers } from "next/headers";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year } = await searchParams;
  const headerStore = await headers();
  const isAdmin = headerStore.get("x-is-admin") === "true";
  if (!month || !year) return null;

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
        } as ArchiveData
      }
      isAdmin={isAdmin}
    />
  );
}
