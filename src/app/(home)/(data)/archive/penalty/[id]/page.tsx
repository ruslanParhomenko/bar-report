import {
  getRemarksByDay,
  RemarksData,
} from "@/app/actions/remarks/remarks-action";
import RemarksForm from "@/features/penalty/penalty-update";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year } = await searchParams;
  const { id: day } = await params;
  if (!day || !month || !year) return null;
  const uniqueKey = `${year}-${month}`;
  const dataRemark = (await getRemarksByDay(uniqueKey, day)) as RemarksData;

  return (
    <RemarksForm
      data={dataRemark as RemarksData}
      month={month}
      year={year}
      day={day}
    />
  );
}
