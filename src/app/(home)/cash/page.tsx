import { getAOByUniqueKey } from "@/app/actions/a-o/ao-action";
import { getCashByYearAndMonth } from "@/app/actions/cash/cash-action";
import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { CASH_MAIN_ROUTE } from "@/constants/endpoint-tag";
import CashPage from "@/features/cash/cash-page";
import { checkAccess } from "@/lib/check-access";
import { ValueParams } from "@/types/params";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const hasAccess = await checkAccess(CASH_MAIN_ROUTE);
  if (!hasAccess) return <InsufficientRights />;

  const valueParams = (await searchParams) as ValueParams;

  const { month, year } = valueParams;

  if (!month || !year) return null;
  const uniqueKey = `${year}-${month}`;

  const [dataCash, dataAo] = await Promise.all([
    getCashByYearAndMonth(year, month),
    getAOByUniqueKey(uniqueKey),
  ]);

  return (
    <CashPage dataAo={dataAo} dataCash={dataCash} valueParams={valueParams} />
  );
}
