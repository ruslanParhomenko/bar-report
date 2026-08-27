import { getTTNByYear } from "@/features/finance/ttn/moda-month/actions/get-ttn-mode";
import { getTtnNbmByYear } from "@/features/finance/ttn/nbm-month/actions/get-nbm-ttn";
import { getProductsNbmByYear } from "@/features/finance/ttn/nbm-products/actions/get-nbm-products";
import TTNPage from "@/features/finance/ttn/ttn-page";
import {
  getDataOrderProducts,
  getDataTTN,
} from "@/features/setting/actions/get-data-json";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year } = await searchParams;
  if (!month || !year) return null;

  const [agentTTN, dataTTN, dataTtnNbm, dataProductsNbm, orderProducts] =
    await Promise.allSettled([
      await getDataTTN(),
      await getTTNByYear(year),
      await getTtnNbmByYear(year),
      await getProductsNbmByYear(year),
      getDataOrderProducts(),
    ]);
  return (
    <TTNPage
      orderProducts={
        orderProducts.status === "fulfilled" ? orderProducts.value : null
      }
      dataTTN={dataTTN.status === "fulfilled" ? dataTTN.value : null}
      dataTtnNbm={dataTtnNbm.status === "fulfilled" ? dataTtnNbm.value : null}
      agentTTN={agentTTN.status === "fulfilled" ? agentTTN.value : null}
      dataProductsNbm={
        dataProductsNbm.status === "fulfilled" ? dataProductsNbm.value : null
      }
      month={month}
      year={year}
    />
  );
}
