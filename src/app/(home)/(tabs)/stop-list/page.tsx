import {
  getStopList,
  StopListType,
} from "@/app/actions/stop-list/stopListAction";
import StopListForm from "@/features/stop-list/stop-list-form";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { tab } = await searchParams;
  if (!tab) return null;
  const data = (await getStopList()) as StopListType[];

  if (!data) return null;
  const filteredData = data
    .filter((d) => d.user_email === tab)
    .map((d) => d.form_data);

  return <StopListForm data={filteredData} nameTag={tab as "bar" | "cucina"} />;
}
