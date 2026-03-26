import { getFinCashRowByYear } from "@/app/actions/fin-cash/fin-cash-action";
import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import FinCashPage from "@/features/fin-cash/fin-cash-page";
import { checkAccess } from "@/lib/check-access";

const SET_ACCESS = ["ADMIN"];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;

  const { year } = await searchParams;
  if (!year) return null;
  const finCashData = await getFinCashRowByYear(year);
  return <FinCashPage finCashData={finCashData} year={year} />;
}
