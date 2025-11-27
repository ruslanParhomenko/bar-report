import ScheduleTableBody from "@/features/schedule/ScheduleTableBody";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ patch: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { patch } = await params;
  const { month, year } = await searchParams;
  const uniqueKey = `${year}-${month}-${patch}`;

  return <ScheduleTableBody uniqueKey={uniqueKey} />;
}
