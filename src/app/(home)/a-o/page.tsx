import { getAOByUniqueKey } from "@/app/actions/a-o/ao-action";
import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { AO_REPORT_MAIN_ROUTE } from "@/constants/endpoint-tag";
import AoForm from "@/features/a-o/ao-form";
import { checkAccess } from "@/lib/check-access";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const hasAccess = await checkAccess(AO_REPORT_MAIN_ROUTE);
  if (!hasAccess) return <InsufficientRights />;

  const { month, year } = await searchParams;
  if (!month || !year) return null;
  const uniqueKey = `${year}-${month}`;

  const dataAo = await getAOByUniqueKey(uniqueKey);

  return (
    <AoForm dataAo={dataAo} month={month as string} year={year as string} />
  );
}
