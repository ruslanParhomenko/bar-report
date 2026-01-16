import { getTTNByUniqueKey } from "@/app/actions/ttn/ttn-actions";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import TTNDayPage from "@/features/ttn/ttn-day-page";
import { checkAccess } from "@/lib/check-access";

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

  const dataTtn = await getTTNByUniqueKey(unique_key);
  return (
    <TTNDayPage
      dataTtn={dataTtn}
      month={month as string}
      year={year as string}
    />
  );
}
