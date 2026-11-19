import { getTodayUSDRateBNM } from "@/app/actions/currency/currency-actions";
import { BarPage } from "@/features/bar";
import {
  getDataBreakList,
  getDataOrderProducts,
  getDataReportBar,
} from "@/features/setting/actions/get-data-json";
import { getEmployees } from "@/features/settings/create-employee/actions/get-employees";

export default async function Page() {
  const [dataBreakList, dataReportBar, currencyUSD, orderProducts, employees] =
    await Promise.allSettled([
      getDataBreakList(),
      getDataReportBar(),
      getTodayUSDRateBNM().catch(() => null),
      getDataOrderProducts(),
      getEmployees(),
    ]);
  const breakListData =
    dataBreakList.status === "fulfilled" ? dataBreakList.value : null;
  const dataReportBarData =
    dataReportBar.status === "fulfilled" ? dataReportBar.value : null;
  const currencyUSDData =
    currencyUSD.status === "fulfilled" ? currencyUSD.value : 0;
  const orderProductsData =
    orderProducts.status === "fulfilled" ? orderProducts.value : null;
  const orderProductsBar =
    orderProductsData?.ttnBar || ({} as Record<string, string[]>);

  const employeesBar =
    employees.status === "fulfilled" ? employees.value : null;

  if (!employeesBar) return null;

  return (
    <BarPage
      dataBreakList={breakListData}
      dataReportBar={dataReportBarData}
      currencyUSD={currencyUSDData}
      orderProducts={orderProductsBar}
      employees={employeesBar}
    />
  );
}
