import { getBreakListByDate } from "@/app/actions/break/break-action";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import { BreakListArchive } from "@/features/break/break-list-archive";
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
  const uniqueKey = `${year}-${month}`;
  const monthNum = Number(MONTHS.indexOf(month) + 1);
  const yearNum = Number(year);

  if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
    throw new Error(`Invalid month/year: ${month}/${year}`);
  }

  //  UTC
  const startDate = new Date(Date.UTC(yearNum, monthNum - 1, 1, 0, 0, 0));
  const endDate = new Date(Date.UTC(yearNum, monthNum, 1, 0, 0, 0));

  // get data
  const breakData = await getBreakListByDate(uniqueKey);

  if (!breakData)
    return (
      <div className="text-bl flex justify-center h-[30vh] items-center">
        not found data
      </div>
    );

  return <BreakListArchive data={breakData} />;
}
