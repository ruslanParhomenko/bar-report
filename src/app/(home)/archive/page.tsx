import { getBreakListByDate } from "@/app/actions/break/break-action";
import { getRemarksByUniqueKey } from "@/app/actions/remarks/remarks-action";
import { getReportByUniqueKey } from "@/app/actions/report-bar/report-bar-action";
import { getReportCucinaByUniqueKey } from "@/app/actions/report-cucina/report-cucina-action";
import { getTipsAddByUniqueKey } from "@/app/actions/tips-add/tips-add-actions";
import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { ARCHIVE_MAIN_ROUTE } from "@/constants/endpoint-tag";

import ArchivePage, { ArchiveData } from "@/features/archive/archive-page";
import { checkAccess } from "@/lib/check-access";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const hasAccess = await checkAccess(ARCHIVE_MAIN_ROUTE);
  if (!hasAccess) return <InsufficientRights />;

  const { month, year } = await searchParams;
  if (!month || !year) return null;

  const uniqueKey = `${year}-${month}`;

  const [dataReportBar, dataBreak, dataReportCucina, dataRemarks, tipsAdd] =
    await Promise.all([
      getReportByUniqueKey(uniqueKey),
      getBreakListByDate(uniqueKey),
      getReportCucinaByUniqueKey(uniqueKey),
      getRemarksByUniqueKey(uniqueKey),
      getTipsAddByUniqueKey(uniqueKey),
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
