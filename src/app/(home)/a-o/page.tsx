import { getAOByUniqueKey } from "@/app/actions/a-o/ao-action";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import AoForm from "@/features/a-o/ao-form";
import { checkAccess } from "@/lib/check-access";

const SET_ACCESS = ["ADMIN", "CASH", "FIN"];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;

  const { month, year } = await searchParams;
  if (!month || !year) return null;
  const uniqueKey = `${year}-${month}`;

  const dataAo = await getAOByUniqueKey(uniqueKey);
  if (!dataAo) return null;

  return (
    <AoForm dataAo={dataAo} month={month as string} year={year as string} />
  );
}
