import { getFinByYear } from "@/app/actions/fin-cash/fin-action";
import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { FIN_CASH_MAIN_ROUTE } from "@/constants/endpoint-tag";
import FinPage from "@/features/fin-cash/fin-page";
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
  const finCashData = await getFinByYear(year);
  return <FinPage finCashData={finCashData} year={year} />;
}
