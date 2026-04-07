import { getBreakListByDate } from "@/app/actions/break/break-action";
import { getRemarksByUniqueKey } from "@/app/actions/remarks/remarks-action";
import { getReportByUniqueKey } from "@/app/actions/report-bar/report-bar-action";
import { getReportCucinaByUniqueKey } from "@/app/actions/report-cucina/report-cucina-action";
import { getTipsAddByUniqueKey } from "@/app/actions/tips-add/tips-add-actions";
import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { ARCHIVE_MAIN_ROUTE } from "@/constants/endpoint-tag";
import { SIDEBAR_NAVIGATION } from "@/constants/sidebar-nav";
import ArchivePage, { ArchiveData } from "@/features/archive/archive-page";
import { checkAccess } from "@/lib/check-access";

const SET_ACCESS =
  SIDEBAR_NAVIGATION.find((item) => item.title === ARCHIVE_MAIN_ROUTE)
    ?.setAcces || [];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;

  const { month, year } = await searchParams;
  if (!month || !year) return null;

  const uniqueKey = `${year}-${month}`;

  const [dataReportBar, dataBreak, dataReportCucina, dataRemarks, tipsAdd] =
    await Promise.all([
      await getReportByUniqueKey(uniqueKey),
      await getBreakListByDate(uniqueKey),
      await getReportCucinaByUniqueKey(uniqueKey),
      await getRemarksByUniqueKey(uniqueKey),
      await getTipsAddByUniqueKey(uniqueKey),
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
