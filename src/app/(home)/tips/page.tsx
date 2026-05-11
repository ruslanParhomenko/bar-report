import { getTipsByYear } from "@/app/actions/tips/tips-action";
import TipsPage from "@/features/tips/tips-page";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year } = await searchParams;
  if (!month || !year) return null;

  const dataTipsYear = await getTipsByYear(year);

  return <TipsPage dataTipsYear={dataTipsYear} />;
}
