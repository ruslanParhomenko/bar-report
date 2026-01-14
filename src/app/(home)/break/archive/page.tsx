import { getBreakListByDate } from "@/app/actions/archive/breakListAction";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import { BreakTableByData } from "@/features/break/BreakTableByData";
import { authOptions } from "@/lib/auth";
import { MONTHS } from "@/utils/getMonthDays";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const SET_ACCESS = ["ADMIN", "MNGR", "USER"];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  if (!SET_ACCESS.includes(session?.user?.role as string))
    return <InsufficientRights />;

  const { month, year } = await searchParams;
  if (!month || !year) return null;
  const monthNum = Number(MONTHS.indexOf(month) + 1);
  const yearNum = Number(year);

  if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
    throw new Error(`Invalid month/year: ${month}/${year}`);
  }

  //  UTC
  const startDate = new Date(Date.UTC(yearNum, monthNum - 1, 1, 0, 0, 0));
  const endDate = new Date(Date.UTC(yearNum, monthNum, 1, 0, 0, 0));

  // get data
  const dataRemarks = await getBreakListByDate({
    startDate,
    endDate,
  });
  return <BreakTableByData data={dataRemarks.breakList} />;
}
