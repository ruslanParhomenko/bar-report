import { getStopList } from "@/app/actions/stop-list/stop-list-action";
import StopListPage from "@/features/stop-list/stop-list-page";


export default async function Page() {
  const dataStopList = await getStopList();
  return <StopListPage data={dataStopList} />;
}
