import { ScheduleCreatePage } from "@/features/schedule/create/schedule-form";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year, tab } = await searchParams;
  if (!month || !year || !tab) return null;
  return (
    <ScheduleCreatePage
      tab={tab}
      month={month as string}
      year={year as string}
    />
  );
}
