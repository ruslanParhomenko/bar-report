import { getDataOrderProducts } from "@/features/setting/actions/get-data-json";
import { getStopList } from "@/features/staff/stop-list/actions/get-stop-list";
import StopListPage from "@/features/staff/stop-list/ui/stop-list-page";

export default async function Page() {
  const [dataStopList, orderProducts] = await Promise.all([
    getStopList(),
    getDataOrderProducts(),
  ]);
  return <StopListPage data={dataStopList} orderProducts={orderProducts} />;
}
