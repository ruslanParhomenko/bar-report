import { UserFormPage } from "@/features/settings/users";
import { getUsers } from "@/features/settings/users/actions/get-users";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, users] = await Promise.all([params, getUsers()]);

  if (!id || !users) return null;

  return <UserFormPage id={id} users={users} />;
}
