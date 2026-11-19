import { SettingPage } from "@/features/setting";
import {
  getDataBreakList,
  getDataMenu,
  getDataMenuDaily,
  getDataOrderProducts,
  getDataPriceList,
  getDataProducts,
  getDataReportBar,
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
    dataReportBar,
  ] = await Promise.allSettled([
    getDataProducts(),
    getDataBreakList(),
    getDataOrderProducts(),
    getDataTTN(),
    getDataPriceList(),
    getDataMenu(),
    getDataMenuDaily(),
    getDataStatusParameters(),
    getDataReportBar(),
  ]);

  const data = {
    productsData: JSON.stringify(
      dataProducts.status === "fulfilled" ? dataProducts.value || [] : [],
      null,
      2,
    ),
    breakListData: JSON.stringify(
      dataBreakList.status === "fulfilled" ? dataBreakList.value || [] : [],
      null,
      2,
    ),
    orderProductsData: JSON.stringify(
      dataOrderProducts.status === "fulfilled"
        ? dataOrderProducts.value || []
        : [],
      null,
      2,
    ),
    ttnData: JSON.stringify(
      dataTTN.status === "fulfilled" ? dataTTN.value || [] : [],
      null,
      2,
    ),
    priceListData: JSON.stringify(
      dataPriceList.status === "fulfilled" ? dataPriceList.value || [] : [],
      null,
      2,
    ),
    menuData: JSON.stringify(
      dataMenu.status === "fulfilled" ? dataMenu.value || [] : [],
      null,
      2,
    ),
    menuDailyData: JSON.stringify(
      dataMenuDaily.status === "fulfilled" ? dataMenuDaily.value || [] : [],
      null,
      2,
    ),
    statusParametersData: JSON.stringify(
      dataStatusParameters.status === "fulfilled"
        ? dataStatusParameters.value || []
        : [],
      null,
      2,
    ),
    reportBarData: JSON.stringify(
      dataReportBar.status === "fulfilled" ? dataReportBar.value || [] : [],
      null,
      2,
    ),
  };

  return <SettingPage data={data} />;
}
