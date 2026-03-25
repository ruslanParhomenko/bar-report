import { ScheduleCreatePage } from "@/features/schedule/create/schedule-form";
import { ValueParams } from "@/types/params";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = (await searchParams) as ValueParams;
  const { month, year, tab } = params;
  if (!month || !year || !tab) return null;
  return <ScheduleCreatePage params={params} />;
}
