import {
  getRemarksById,
  RemarksData,
} from "@/app/actions/remarks/remarksAction";
import RemarksForm from "@/features/penalty/penalty-form";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dataRemark = await getRemarksById(id as string);
  return <RemarksForm dataRemark={dataRemark as RemarksData} />;
}
