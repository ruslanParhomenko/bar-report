import { getDataTTN } from "@/app/actions/data-constants/data-ttn-action";
import {
  getTTNByYear,
  getTTNByYearAndMonth,
} from "@/app/actions/ttn/ttn-actions";
import { ProtectedPage } from "@/components/wrapper/protected-page";
import { TTN_MAIN_ROUTE } from "@/constants/endpoint-tag";
import TTNPage from "@/features/ttn/ttn-page";
import { getPrevUniqueKey } from "@/utils/get-month-days";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year } = await searchParams;
  if (!month || !year) return null;

  const { prevYear, prevMonth } = getPrevUniqueKey(year, month);
  const [dataTtn, dataTtnPrev, agentTTN, dataTTN] = await Promise.all([
    await getTTNByYearAndMonth(year, month),
    await getTTNByYearAndMonth(prevYear, prevMonth),
    await getDataTTN(),
    await getTTNByYear(year),
  ]);
  return (
    <ProtectedPage route={TTN_MAIN_ROUTE}>
      <TTNPage
        dataTTN={dataTTN}
        dataTtn={dataTtn}
        dataTtnPrev={dataTtnPrev}
        agentTTN={agentTTN}
        month={month}
        year={year}
      />
    </ProtectedPage>
  );
}
