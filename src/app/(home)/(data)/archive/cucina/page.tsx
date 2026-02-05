import { getReportCucinaByUniqueKey } from "@/app/actions/report-cucina/report-cucina-action";
import ReportCucinaTable from "@/components/table/report-cucina-table/ReportCucinaTable";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import { checkAccess } from "@/lib/check-access";

const SET_ACCESS = ["ADMIN", "CUCINA", "MNGR", "USER"];

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ patch: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;

  const { month, year } = await searchParams;
  if (!month || !year) return null;

  const uniqueKey = `${year}-${month}`;

  const dataReportCucina = await getReportCucinaByUniqueKey(uniqueKey);

  return <ReportCucinaTable data={dataReportCucina} />;
}
