import { getTodayUSDRateBNM } from "@/app/actions/currency/currency-actions";
import { BarPage } from "@/features/bar";
import {
  getDataBreakList,
  getDataOrderProducts,
} from "@/features/setting/actions/get-data-json";

export default async function Page() {
  const [dataBreakList, currencyUSD, orderProducts] = await Promise.allSettled([
    getDataBreakList(),
    getTodayUSDRateBNM().catch(() => null),
    getDataOrderProducts(),
  ]);
  const breakListData =
    dataBreakList.status === "fulfilled" ? dataBreakList.value : null;
  const currencyUSDData =
    currencyUSD.status === "fulfilled" ? currencyUSD.value : 0;
  const orderProductsData =
    orderProducts.status === "fulfilled" ? orderProducts.value : null;
  const orderProductsBar =
    orderProductsData?.ttnBar || ({} as Record<string, string[]>);

  return (
    <BarPage
      dataBreakList={breakListData}
      currencyUSD={currencyUSDData}
      orderProducts={orderProductsBar}
    />
  );
}
