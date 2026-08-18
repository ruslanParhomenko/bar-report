import { getTodayUSDRateBNM } from "@/app/actions/currency/currency-actions";
import { getEmployees } from "@/features/settings/create-employee/actions/get-employees";
import {
  getDataBreakList,
  getDataOrderProducts,
} from "@/features/settings/setting/actions/get-data-json";
import { BarPage } from "@/features/staff/bar";

export default async function Page() {
  const [dataBreakList, currencyUSD, employees, orderProducts] =
    await Promise.all([
      getDataBreakList(),
      getTodayUSDRateBNM().catch(() => null),
      getEmployees(),
      getDataOrderProducts(),
    ]);

  return (
    <BarPage
      dataBreakList={dataBreakList}
      currencyUSD={currencyUSD ?? 0}
      employees={employees}
      orderProducts={orderProducts}
    />
  );
}
