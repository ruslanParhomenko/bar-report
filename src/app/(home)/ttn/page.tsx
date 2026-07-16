import { getDataTTN } from "@/app/actions/data-constants/data-ttn-action";
import { getTTNByYear } from "@/app/actions/ttn/ttn-actions";
import { getTtnNbmByYear } from "@/app/actions/ttn/ttn-nbm-action";
import TTNPage from "@/features/ttn/ttn-page";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year } = await searchParams;
  if (!month || !year) return null;

  const [agentTTN, dataTTN, dataTtnNbm] = await Promise.all([
    await getDataTTN(),
    await getTTNByYear(year),
    await getTtnNbmByYear(year),
  ]);
  return (
    <TTNPage
      dataTTN={dataTTN}
      dataTtnNbm={dataTtnNbm}
      agentTTN={agentTTN}
      month={month}
      year={year}
    />
  );
}
