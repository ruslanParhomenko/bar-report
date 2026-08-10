import { AoPage } from "@/features/finance/a-o";
import { getAOByYear } from "@/features/finance/a-o/actions/get-ao";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { year } = await searchParams;
  if (!year) return null;

  const dataAoYear = await getAOByYear(year as string);

  return <AoPage dataAoYear={dataAoYear} />;
}
