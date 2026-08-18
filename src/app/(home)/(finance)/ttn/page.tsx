import { getTTNByYear } from "@/features/finance/ttn/moda-month/actions/get-ttn-mode";
import { getTtnNbmByYear } from "@/features/finance/ttn/nbm-month/actions/get-nbm-ttn";
import { getProductsNbmByYear } from "@/features/finance/ttn/nbm-products/actions/get-nbm-products";
import TTNPage from "@/features/finance/ttn/ttn-page";
import {
  getDataOrderProducts,
  getDataTTN,
} from "@/features/settings/setting/actions/get-data-json";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year } = await searchParams;
  if (!month || !year) return null;

  const [agentTTN, dataTTN, dataTtnNbm, dataProductsNbm, orderProducts] =
    await Promise.all([
      await getDataTTN(),
      await getTTNByYear(year),
      await getTtnNbmByYear(year),
      await getProductsNbmByYear(year),
      getDataOrderProducts(),
    ]);
  return (
    <TTNPage
      orderProducts={orderProducts}
      dataTTN={dataTTN}
      dataTtnNbm={dataTtnNbm}
      agentTTN={agentTTN}
      dataProductsNbm={dataProductsNbm}
      month={month}
      year={year}
    />
  );
}
