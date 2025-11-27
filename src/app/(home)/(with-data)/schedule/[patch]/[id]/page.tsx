import { ScheduleCreatePage } from "@/features/schedule/create/ScheduleCreatePage";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; patch: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id, patch } = await params;
  const { month, year } = await searchParams;
  return (
    <ScheduleCreatePage
      id={id}
      month={month as string}
      year={year as string}
      patch={patch}
    />
  );
}
