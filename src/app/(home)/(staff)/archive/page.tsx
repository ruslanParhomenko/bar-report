import { getReportKitchenByYearMonth } from "@/app/actions/report-kitchen/kitchen-action";
import ArchivePage, {
  ArchiveData,
} from "@/features/staff/archive/archive-page";
import { getBreakListByYearMonth } from "@/features/staff/bar/break/actions/get-break";
import { getRemarksByYearMonth } from "@/features/staff/bar/penalty/actions/get-penalty";
import { getReportBarByYearMonth } from "@/features/staff/bar/report/actions/get-report-bar";
import { getTipsAddByYearMonth } from "@/features/staff/bar/tips-add/actions/get-tips-add";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year } = await searchParams;
  if (!month || !year) return null;

  const [dataReportBar, dataBreak, dataReportCucina, dataRemarks, tipsAdd] =
    await Promise.all([
      getReportBarByYearMonth(year, month),
      getBreakListByYearMonth(year, month),
      getReportKitchenByYearMonth(year, month),
      getRemarksByYearMonth(year, month),
      getTipsAddByYearMonth(year, month),
    ]);
  return (
    <ArchivePage
      archiveData={
        {
          bar: dataReportBar,
          breakList: dataBreak,
          cucina: dataReportCucina,
          penalty: dataRemarks,
          tips: tipsAdd,
        } as ArchiveData
      }
    />
  );
}
