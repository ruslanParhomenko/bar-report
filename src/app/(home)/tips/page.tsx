import { getTipsByYearAndMonth } from "@/app/actions/tips/tips-action";
import { ProtectedPage } from "@/components/wrapper/protected-page";
import { TIPS_MAIN_ROUTE } from "@/constants/endpoint-tag";
import TipsPage from "@/features/tips/tips-page";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year } = await searchParams;
  if (!month || !year) return null;

  const dataTips = await getTipsByYearAndMonth(year, month);

  return (
    <ProtectedPage route={TIPS_MAIN_ROUTE}>
      <TipsPage dataTips={dataTips} />
    </ProtectedPage>
  );
}
