import { getCashFormById } from "@/app/actions/cash/cashAction";
import { getTipsFormById } from "@/app/actions/tips/tipsAction";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import { PageTips } from "@/features/tips/PageTips";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const SET_ACCESS = ["ADMIN", "CASH", "MNGR"];
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year } = await searchParams;
  const uniqueKey = `${year}-${month}`;

  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");
  if (!SET_ACCESS.includes(session?.user?.role as string))
    return <InsufficientRights />;

  const [dataTips, dataCash] = await Promise.all([
    getTipsFormById(uniqueKey),
    getCashFormById(uniqueKey),
  ]);
  return (
    <PageTips
      dataTips={dataTips}
      dataCash={dataCash}
      month={month as string}
      year={year as string}
    />
  );
}
