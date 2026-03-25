import { getFinCashRowByYear } from "@/app/actions/fin-cash/fin-cash-action";
import FinCashPage from "@/features/fin-cash/fin-cash-page";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { year } = await searchParams;
  if (!year) return null;
  const finCashData = await getFinCashRowByYear(year);
  return <FinCashPage finCashData={finCashData} year={year} />;
}
