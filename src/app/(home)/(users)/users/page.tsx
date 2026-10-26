import { ADMIN } from "@/constants/roles";
import { UsersPage } from "@/features/users";
import { getUsers } from "@/features/users/actions/get-users";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function Page() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === ADMIN;

  if (!isAdmin) return null;

  const users = await getUsers();

  return <UsersPage isAdmin={isAdmin} users={users} />;
}
