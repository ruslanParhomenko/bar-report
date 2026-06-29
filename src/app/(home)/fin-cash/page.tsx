import {
  getFinBarByYear,
  getFinByYear,
} from "@/app/actions/fin-cash/fin-action";
import FinPage from "@/features/fin-cash/fin-page";

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

  console.log("finCashData", finCashData);
  console.log("finBarData", finBarData);

  return (
    <FinPage finCashData={finCashData} finBarData={finBarData} year={year} />
  );
}
