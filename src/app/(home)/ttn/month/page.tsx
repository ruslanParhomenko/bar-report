import { getTTNByUniqueKey } from "@/app/actions/ttn/ttn-actions";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import TTNForm from "@/features/ttn/ttn-form";
import { checkAccess } from "@/lib/check-access";
import { getPrevUniqueKey, Month } from "@/utils/getMonthDays";

const SET_ACCESS = ["ADMIN", "FIN"];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;

  const { month, year } = await searchParams;
  const unique_key = `${year}-${month}`;
  const unique_key_prev = getPrevUniqueKey(year!, month as Month);

  const dataTtn = await getTTNByUniqueKey(unique_key);
  const dataTtnPrev = await getTTNByUniqueKey(unique_key_prev);
  return (
    <TTNForm
      dataTtn={dataTtn}
      dataTtnPrev={dataTtnPrev}
      month={month as string}
      year={year as string}
    />
  );
}
