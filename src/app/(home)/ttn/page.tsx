import { getDataTTN } from "@/app/actions/data-constants/data-ttn-action";
import { getTTNByUniqueKey } from "@/app/actions/ttn/ttn-actions";
import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { TTN_MAIN_ROUTE } from "@/constants/endpoint-tag";
import { SIDEBAR_NAVIGATION } from "@/constants/sidebar-nav";
import TTNPage from "@/features/ttn/ttn-page";
import { checkAccess } from "@/lib/check-access";
import { getPrevUniqueKey } from "@/utils/get-month-days";

const SET_ACCESS =
  SIDEBAR_NAVIGATION.find((item) => item.title === TTN_MAIN_ROUTE)?.setAcces ||
  [];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const hasAccess = await checkAccess(SET_ACCESS);
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
