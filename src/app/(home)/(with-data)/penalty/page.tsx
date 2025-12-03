import {
  getRemarksByDate,
  RemarksData,
} from "@/app/actions/remarks/remarksAction";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import { PenaltyPage } from "@/features/penalty/PenaltyPage";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const CLOSE_ACCESS = ["OBSERVER", "CASH"];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year } = await searchParams;

  if (!month || !year) return null;

  // Приводим месяц к числу и корректируем для UTC (0 = Январь)
  const monthNum = Number(month);
  const yearNum = Number(year);

  if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
    throw new Error(`Invalid month/year: ${month}/${year}`);
  }

  // Даты в UTC
  const startDate = new Date(Date.UTC(yearNum, monthNum - 1, 1, 0, 0, 0)); // начало месяца
  const endDate = new Date(Date.UTC(yearNum, monthNum, 1, 0, 0, 0)); // начало следующего месяца

  // access control
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  if (CLOSE_ACCESS.includes(session.user?.role ?? ""))
    return <InsufficientRights />;

  // get data
  const remarks = (await getRemarksByDate({
    startDate,
    endDate,
  })) as RemarksData;

  return <PenaltyPage data={remarks.remarks} />;
}
