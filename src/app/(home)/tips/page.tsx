import { getTipsByYear } from "@/app/actions/tips/tips-action";
import TipsPage from "@/features/tips/tips-page";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { year } = await searchParams;
  if (!year) return null;

  const dataTipsYear = await getTipsByYear(year);

  return <TipsPage dataTipsYear={dataTipsYear} />;
}
