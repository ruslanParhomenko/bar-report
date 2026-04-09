import { getFinCashRowByYear } from "@/app/actions/fin-cash/fin-cash-action";
import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { FIN_CASH_MAIN_ROUTE } from "@/constants/endpoint-tag";

import FinCashPage from "@/features/fin-cash/fin-cash-page";
import { checkAccess } from "@/lib/check-access";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const hasAccess = await checkAccess(FIN_CASH_MAIN_ROUTE);
  if (!hasAccess) return <InsufficientRights />;

  const { year } = await searchParams;
  if (!year) return null;
  const finCashData = await getFinCashRowByYear(year);
  return <FinCashPage finCashData={finCashData} year={year} />;
}
