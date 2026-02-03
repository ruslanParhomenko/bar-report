import { getReportByUniqueKey } from "@/app/actions/report-bar/report-bar-action";
import ReportBarTable from "@/components/table/report-bar-table/ReportBarTable";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import { checkAccess } from "@/lib/check-access";

const SET_ACCESS = ["ADMIN", "BAR", "MNGR", "USER"];

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

  // get data
  const dataReportBar = await getReportByUniqueKey(uniqueKey);

  return <ReportBarTable data={dataReportBar} />;
}
