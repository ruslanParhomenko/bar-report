import { SchedulePage } from "@/features/schedule/SchedulePage";

export default async function Page({
  params,
}: {
  params: Promise<{ patch: string }>;
}) {
  const { patch } = await params;
  return <SchedulePage patch={patch} />;
}
