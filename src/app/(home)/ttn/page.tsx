import { getDataTTN } from "@/app/actions/data-constants/data-ttn-action";
import { getTTNByUniqueKey } from "@/app/actions/ttn/ttn-actions";
import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { TTN_MAIN_ROUTE } from "@/constants/endpoint-tag";
import TTNPage from "@/features/ttn/ttn-page";
import { checkAccess } from "@/lib/check-access";
import { getPrevUniqueKey } from "@/utils/get-month-days";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const hasAccess = await checkAccess(TTN_MAIN_ROUTE);
  if (!hasAccess) return <InsufficientRights />;

  const { month, year } = await searchParams;
  if (!month || !year) return null;
  const unique_key = `${year}-${month}`;
  const unique_key_prev = getPrevUniqueKey(year, month);
  const [dataTtn, dataTtnPrev, agentTTN] = await Promise.all([
    await getTTNByUniqueKey(unique_key),
    await getTTNByUniqueKey(unique_key_prev),
    await getDataTTN(),
  ]);
  return (
    <TTNPage
      dataTtn={dataTtn}
      dataTtnPrev={dataTtnPrev}
      agentTTN={agentTTN}
      month={month}
      year={year}
    />
  );
}
