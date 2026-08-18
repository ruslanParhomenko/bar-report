import { UserFormPage } from "@/features/settings/users";
import { getUsers } from "@/features/settings/users/actions/get-users";

export default async function Page() {
  const users = await getUsers();

  return <UserFormPage users={users} />;
}
