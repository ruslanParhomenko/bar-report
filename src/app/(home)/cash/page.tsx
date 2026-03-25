import { getAOByUniqueKey } from "@/app/actions/a-o/ao-action";
import { getCashFormById } from "@/app/actions/cash/cash-action";
import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import CashPage from "@/features/cash/cash-page";

import { checkAccess } from "@/lib/check-access";
import { ValueParams } from "@/types/params";

const SET_ACCESS = ["ADMIN", "CASH", "FIN", "USER"];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;

  const valueParams = (await searchParams) as ValueParams;

  const { month, year, tab } = valueParams;
  if (!month || !year || !tab) return null;
  const uniqueKey = `${year}-${month}`;

  const [dataCash, dataAo] = await Promise.all([
    getCashFormById(uniqueKey),
    getAOByUniqueKey(uniqueKey),
  ]);

  return (
    <CashPage dataAo={dataAo} dataCash={dataCash} valueParams={valueParams} />
  );
}
