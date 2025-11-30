import { getStopList } from "@/app/actions/stop-list/stopListAction";
import StopListPage from "@/features/stop-list/StopListPage";
export default async function Page() {
  const data = (await getStopList())?.[0].form_data;
  return <StopListPage data={data} />;
}
