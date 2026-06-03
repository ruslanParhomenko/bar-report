import { getAOByYear } from "@/app/actions/a-o/ao-action";
import AoPage from "@/features/a-o/ao-page";

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
