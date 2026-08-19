import { UserFormPage } from "@/features/users";
import { getUsers } from "@/features/users/actions/get-users";

export default async function Page() {
  const users = await getUsers();

  return <UserFormPage />;
}
