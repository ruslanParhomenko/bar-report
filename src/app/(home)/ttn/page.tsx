import { getTTNByUniqueKey } from "@/app/actions/ttn/ttn-actions";
import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import TTNPage from "@/features/ttn/ttn-page";
import { checkAccess } from "@/lib/check-access";
import { getPrevUniqueKey, MONTHS } from "@/utils/get-month-days";

const SET_ACCESS = ["ADMIN", "FIN"];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;

  const { month, year } = await searchParams;

  const setMonth = month ?? MONTHS[new Date().getMonth()];
  const setYear = year ?? new Date().getFullYear().toString();
  const unique_key = `${setYear}-${setMonth}`;
  const unique_key_prev = getPrevUniqueKey(setYear, setMonth);
  const [dataTtn, dataTtnPrev, dataTtnByDay] = await Promise.all([
    await getTTNByUniqueKey(unique_key),
    await getTTNByUniqueKey(unique_key_prev),
    await getTTNByUniqueKey(unique_key),
  ]);
  return (
    <TTNPage
      dataTtn={dataTtn}
      dataTtnPrev={dataTtnPrev}
      dataTtnByDay={dataTtnByDay}
      month={setMonth}
      year={setYear}
    />
  );
}
