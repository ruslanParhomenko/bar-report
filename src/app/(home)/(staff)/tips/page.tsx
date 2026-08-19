import { TipsPage } from "@/features/staff/tips";
import { getTipsByYear } from "@/features/staff/tips/actions/get-tips";
import { headers } from "next/headers";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { year } = await searchParams;
  if (!year) return null;

  const headerStore = await headers();
  const isAdmin = headerStore.get("x-is-admin") === "true";

  const dataTipsYear = await getTipsByYear(year);

  return <TipsPage dataTipsYear={dataTipsYear} isAdmin={isAdmin} />;
}
