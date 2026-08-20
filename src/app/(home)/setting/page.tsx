import { SettingPage } from "@/features/setting";
import {
  getDataBreakList,
  getDataMenu,
  getDataMenuDaily,
  getDataOrderProducts,
  getDataPriceList,
  getDataProducts,
  getDataStatusParameters,
  getDataTTN,
} from "@/features/setting/actions/get-data-json";

export default async function Page() {
  const [
    dataProducts,
    dataBreakList,
    dataOrderProducts,
    dataTTN,
    dataPriceList,
    dataMenu,
    dataMenuDaily,
    dataStatusParameters,
  ] = await Promise.all([
    getDataProducts(),
    getDataBreakList(),
    getDataOrderProducts(),
    getDataTTN(),
    getDataPriceList(),
    getDataMenu(),
    getDataMenuDaily(),
    getDataStatusParameters(),
  ]);

  const data = {
    productsData: JSON.stringify(dataProducts, null, 2),
    breakListData: JSON.stringify(dataBreakList, null, 2),
    orderProductsData: JSON.stringify(dataOrderProducts, null, 2),
    ttnData: JSON.stringify(dataTTN, null, 2),
    priceListData: JSON.stringify(dataPriceList, null, 2),
    menuData: JSON.stringify(dataMenu, null, 2),
    menuDailyData: JSON.stringify(dataMenuDaily, null, 2),
    statusParametersData: JSON.stringify(dataStatusParameters, null, 2),
  };

  return <SettingPage data={data} />;
}
