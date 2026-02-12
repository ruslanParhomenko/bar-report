import { getRemarksByDay } from "@/app/actions/remarks/remarks-action";
import PenaltyUpdate from "@/features/penalty/penalty-update";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { id } = await params;
  const { month, year } = await searchParams;
  if (!month || !year || !id) return null;

  const uniqueKey = `${year}-${month}`;
  const dataByDay = await getRemarksByDay(uniqueKey, id);
  if (!dataByDay) return null;

  return <PenaltyUpdate data={dataByDay} month={month} year={year} day={id} />;
}
