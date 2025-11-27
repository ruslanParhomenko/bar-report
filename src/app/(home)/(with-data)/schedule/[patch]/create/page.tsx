import { ScheduleCreatePage } from "@/features/schedule/create/ScheduleCreatePage";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ patch: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { patch } = await params;
  const { month, year } = await searchParams;
  return (
    <ScheduleCreatePage
      patch={patch}
      month={month as string}
      year={year as string}
    />
  );
}
