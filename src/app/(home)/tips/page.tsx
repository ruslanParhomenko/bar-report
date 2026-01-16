import { getCashFormById } from "@/app/actions/cash/cashAction";
import { getTipsFormById } from "@/app/actions/tips/tipsAction";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import TipsForm from "@/features/tips/tips-form";
import { checkAccess } from "@/lib/check-access";

const SET_ACCESS = ["ADMIN", "MNGR"];
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;

  const { month, year } = await searchParams;
  if (!month || !year) return null;
  const uniqueKey = `${year}-${month}`;

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
