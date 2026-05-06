import { getRemarksByDay } from "@/app/actions/remarks/remarks-action";
import PenaltyUpdate from "@/features/archive/penalty-details/penalty-update";

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

  const day = id;

  const dataByDay = await getRemarksByDay(year, month, day);

  if (!dataByDay) return null;

  return <PenaltyUpdate data={dataByDay} month={month} year={year} day={day} />;
}
