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
  const dataSelect = `${year}-${month}`;
  const startDate = new Date(`${dataSelect}-01T00:00:00`);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  // access control
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  if (CLOSE_ACCESS.includes(session?.user?.role as string))
    return <InsufficientRights />;

  // get data
  const remarks = (await getRemarksByDate({
    startDate,
    endDate,
  })) as RemarksData;
  return <PenaltyPage data={remarks.remarks} />;
}
