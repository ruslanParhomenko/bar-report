import { getFinByYear } from "@/app/actions/fin-cash/fin-action";
import FinPage from "@/features/fin-cash/fin-page";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { year } = await searchParams;
  if (!year) return null;
  const finCashData = await getFinByYear(year);
  return <FinPage finCashData={finCashData} year={year} />;
}
