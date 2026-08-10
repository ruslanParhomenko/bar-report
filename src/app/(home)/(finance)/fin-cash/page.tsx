import { FinPage } from "@/features/finance/fin-cash";
import {
  getFinBarByYear,
  getFinByYear,
} from "@/features/finance/fin-cash/actions/get-fin-cash";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { year } = await searchParams;
  if (!year) return null;
  const [finCashData, finBarData] = await Promise.all([
    getFinByYear(year),
    getFinBarByYear(year),
  ]);

  return (
    <FinPage finCashData={finCashData} finBarData={finBarData} year={year} />
  );
}
