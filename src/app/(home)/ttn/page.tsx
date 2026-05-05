import { getDataTTN } from "@/app/actions/data-constants/data-ttn-action";
import { getTTNByYear } from "@/app/actions/ttn/ttn-actions";
import { ProtectedPage } from "@/components/wrapper/protected-page";
import { TTN_MAIN_ROUTE } from "@/constants/endpoint-tag";
import TTNPage from "@/features/ttn/ttn-page";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year } = await searchParams;
  if (!month || !year) return null;

  const [agentTTN, dataTTN] = await Promise.all([
    await getDataTTN(),
    await getTTNByYear(year),
  ]);
  return (
    <ProtectedPage route={TTN_MAIN_ROUTE}>
      <TTNPage dataTTN={dataTTN} agentTTN={agentTTN} />
    </ProtectedPage>
  );
}
