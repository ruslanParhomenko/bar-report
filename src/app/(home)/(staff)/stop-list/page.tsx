import { getStopList } from "@/features/staff/stop-list/actions/get-stop-list";
import StopListPage from "@/features/staff/stop-list/ui/stop-list-page";

export default async function Page() {
  const dataStopList = await getStopList();
  return <StopListPage data={dataStopList} />;
}
