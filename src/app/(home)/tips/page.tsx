import { getCashFormById } from "@/app/actions/cash/cashAction";
import { getTipsFormById } from "@/app/actions/tips/tipsAction";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import TipsForm from "@/features/tips/tips-form";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const SET_ACCESS = ["ADMIN", "MNGR"];
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year } = await searchParams;
  if (!month || !year) return null;
  const uniqueKey = `${year}-${month}`;

  const session = await getServerSession(authOptions);
  if (!SET_ACCESS.includes(session?.user?.role as string))
    return <InsufficientRights />;

  const [dataTips, dataCash] = await Promise.all([
    getTipsFormById(uniqueKey),
    getCashFormById(uniqueKey),
  ]);
  return (
    <TipsForm
      dataTips={dataTips}
      dataCash={dataCash}
      month={month as string}
      year={year as string}
    />
  );
}
