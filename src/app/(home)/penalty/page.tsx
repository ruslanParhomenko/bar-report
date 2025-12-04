import {
  getRemarksByDate,
  RemarksData,
} from "@/app/actions/remarks/remarksAction";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import { PagePenalty } from "@/features/penalty/PagePenalty";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const CLOSE_ACCESS = ["OBSERVER", "CASH"];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year, tab } = await searchParams;

  if (!month || !year) return null;

  const monthNum = Number(month);
  const yearNum = Number(year);

  if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
    throw new Error(`Invalid month/year: ${month}/${year}`);
  }

  // Даты в UTC
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
