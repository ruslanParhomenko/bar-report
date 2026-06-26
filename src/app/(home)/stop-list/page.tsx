import { getStopList } from "@/app/actions/stop-list/stop-list-action";
import StopListForm from "@/features/stop-list/stop-list-form";

export default async function Page() {
  const dataStopList = await getStopList();
  return <StopListForm data={dataStopList} />;
}
