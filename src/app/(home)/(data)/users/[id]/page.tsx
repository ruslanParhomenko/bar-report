import { getUsersById, UserData } from "@/app/actions/users/userAction";
import UsersForm from "@/features/users/users-form";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) return null;
  const data = (await getUsersById(id as string)) as UserData;
  return <UsersForm data={data} />;
}
