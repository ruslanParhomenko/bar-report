import { getDataTTN } from "@/app/actions/data-constants/data-ttn-action";
import { getTTNByYear } from "@/app/actions/ttn/ttn-actions";
import { getTtnNbmByYear } from "@/app/actions/ttn/ttn-nbm-action";
import { getProductsNbmByYear } from "@/app/actions/ttn/ttn-nbm-products-action";
import ChartTTNPage from "@/features/chart-ttn/chart-ttn-page";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { year } = await searchParams;
  if (!year) return null;

  const [agentTTN, dataTTN, dataNbmTtn, dataProductsNbm] = await Promise.all([
    await getDataTTN(),
    await getTTNByYear(year),
    await getTtnNbmByYear(year),
    await getProductsNbmByYear(year),
  ]);

  return (
    <ChartTTNPage
      agentTTN={agentTTN}
      dataTTN={dataTTN}
      dataNbmTtn={dataNbmTtn}
      dataProductsNbm={dataProductsNbm}
    />
  );
}
