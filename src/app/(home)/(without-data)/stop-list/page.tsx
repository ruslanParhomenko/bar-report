import { getStopList } from "@/app/actions/stop-list/stopListAction";
import StopListPage from "@/features/stop-list/StopListPage";
export default async function Page() {
  const data = await getStopList();
  return <StopListPage data={data} />;
}
