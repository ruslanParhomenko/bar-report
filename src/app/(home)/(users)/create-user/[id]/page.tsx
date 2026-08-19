import { UserFormPage } from "@/features/users";
import { getUsers } from "@/features/users/actions/get-users";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, users] = await Promise.all([params, getUsers()]);

  if (!id || !users) return null;

  const user = users.find((u) => u.id === id);

  return <UserFormPage user={user} />;
}
