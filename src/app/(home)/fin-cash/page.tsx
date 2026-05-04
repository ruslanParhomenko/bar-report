import { getFinByYear } from "@/app/actions/fin-cash/fin-action";
import { ProtectedPage } from "@/components/wrapper/protected-page";
import { FIN_CASH_MAIN_ROUTE } from "@/constants/endpoint-tag";
import FinPage from "@/features/fin-cash/fin-page";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { year } = await searchParams;
  if (!year) return null;
  const finCashData = await getFinByYear(year);
  return (
    <ProtectedPage route={FIN_CASH_MAIN_ROUTE}>
      <FinPage finCashData={finCashData} year={year} />
    </ProtectedPage>
  );
}
