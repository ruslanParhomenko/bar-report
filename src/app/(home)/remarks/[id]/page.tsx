import { getRemarksById } from "@/app/actions/remarks/remarksAction";
import RemarksFormById from "@/features/breakList/RemarksFormById";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const remark = await getRemarksById(id as string);
  return <RemarksFormById data={remark} />;
}
