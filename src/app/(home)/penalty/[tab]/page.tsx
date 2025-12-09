import {
  getRemarksByDate,
  RemarksData,
} from "@/app/actions/remarks/remarksAction";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import { PagePenalty } from "@/features/penalty/PagePenalty";
import { authOptions } from "@/lib/auth";
import { MONTHS } from "@/utils/getMonthDays";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const CLOSE_ACCESS = ["OBSERVER", "CASH"];

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ tab: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year } = await searchParams;
  const { tab } = await params;

  if (!tab || !month || !year) return null;

  const monthNum = Number(MONTHS.indexOf(month) + 1);
  const yearNum = Number(year);

  if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
    throw new Error(`Invalid month/year: ${month}/${year}`);
  }

  // UTC
  const startDate = new Date(Date.UTC(yearNum, monthNum - 1, 1, 0, 0, 0));
  const endDate = new Date(Date.UTC(yearNum, monthNum, 1, 0, 0, 0));

  // access control
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  if (CLOSE_ACCESS.includes(session.user?.role ?? ""))
    return <InsufficientRights />;

  // get data
  const remarks = await getRemarksByDate({
    startDate,
    endDate,
  });

  return (
    <PagePenalty data={remarks.remarks as RemarksData[]} tab={tab as string} />
  );
}
