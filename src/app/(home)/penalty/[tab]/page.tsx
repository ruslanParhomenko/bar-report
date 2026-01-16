import {
  getRemarksByDate,
  RemarksData,
} from "@/app/actions/remarks/remarksAction";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import PenaltyPage from "@/features/penalty/penalty-page";
import { checkAccess } from "@/lib/check-access";
import { MONTHS } from "@/utils/getMonthDays";

const SET_ACCESS = ["ADMIN", "BAR", "MNGR", "USER"];

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ tab: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;

  const { month, year } = await searchParams;
  if (!month || !year) return null;
  const { tab } = await params;

  const monthNum = Number(MONTHS.indexOf(month) + 1);
  const yearNum = Number(year);

  if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
    throw new Error(`Invalid month/year: ${month}/${year}`);
  }

  // UTC
  const startDate = new Date(Date.UTC(yearNum, monthNum - 1, 1, 0, 0, 0));
  const endDate = new Date(Date.UTC(yearNum, monthNum, 1, 0, 0, 0));

  // get data
  const remarks = await getRemarksByDate({
    startDate,
    endDate,
  });

  return (
    <PenaltyPage data={remarks.remarks as RemarksData[]} tab={tab as string} />
  );
}
