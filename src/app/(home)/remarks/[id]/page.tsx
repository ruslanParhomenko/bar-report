import { getRemarksById } from "@/app/actions/archive/remarksAction";
import RemarksFormById from "@/features/breakList/RemarksFormById";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const remark = await getRemarksById(id as string);
  return <RemarksFormById data={remark} />;
};

export default Page;
