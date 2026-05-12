import { getBreakListByYearMonth } from "@/app/actions/break/break-action";
import { getRemarksByYearMonth } from "@/app/actions/remarks/remarks-action";
import { getReportBarByYearMonth } from "@/app/actions/report-bar/report-bar-action";
import { getReportKitchenByYearMonth } from "@/app/actions/report-kitchen/kitchen-action";
import { getTipsAddByYearMonth } from "@/app/actions/tips-add/tips-add-actions";

import ArchivePage, { ArchiveData } from "@/features/archive/archive-page";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year, tab } = await searchParams;
  if (!month || !year || !tab) return null;

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
      tab={tab}
    />
  );
}
