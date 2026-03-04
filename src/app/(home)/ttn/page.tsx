import { getTTNByUniqueKey } from "@/app/actions/ttn/ttn-actions";
import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import TTNPage from "@/features/ttn/ttn-page";
import { checkAccess } from "@/lib/check-access";
import { getPrevUniqueKey } from "@/utils/get-month-days";

const SET_ACCESS = ["ADMIN", "FIN"];

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
  const [dataTtn, dataTtnPrev] = await Promise.all([
    await getTTNByUniqueKey(unique_key),
    await getTTNByUniqueKey(unique_key_prev),
  ]);
  return (
    <TTNPage
      dataTtn={dataTtn}
      dataTtnPrev={dataTtnPrev}
      month={month}
      year={year}
    />
  );
}
