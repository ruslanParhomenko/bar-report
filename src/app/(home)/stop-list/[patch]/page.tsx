import {
  getStopList,
  StopListType,
} from "@/app/actions/stop-list/stopListAction";
import StopListPage from "@/features/stop-list/StopListPage";

export default async function Page({
  params,
}: {
  params: Promise<{ patch: string }>;
}) {
  const { patch } = await params;
  if (!patch) return null;
  const data = (await getStopList()) as StopListType[];

  if (!data) return null;
  const filteredData = data
    .filter((d) => d.user_email === patch)
    .map((d) => d.form_data);

  return (
    <StopListPage data={filteredData} nameTag={patch as "bar" | "cucina"} />
  );
}
