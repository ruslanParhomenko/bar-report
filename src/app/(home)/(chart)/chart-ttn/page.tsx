import ChartTTNPage from "@/features/chart/chart-ttn/chart-ttn-page";
import { getTTNByYear } from "@/features/finance/ttn/moda-month/actions/get-ttn-mode";
import { getTtnNbmByYear } from "@/features/finance/ttn/nbm-month/actions/get-nbm-ttn";
import { getProductsNbmByYear } from "@/features/finance/ttn/nbm-products/actions/get-nbm-products";
import { getDataTTN } from "@/features/setting/actions/get-data-json";

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
