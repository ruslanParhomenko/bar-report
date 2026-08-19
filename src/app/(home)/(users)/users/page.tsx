import { UsersPage } from "@/features/users";
import { getUsers } from "@/features/users/actions/get-users";
import { headers } from "next/headers";

export default async function Page() {
  const [headerStore, users] = await Promise.all([headers(), getUsers()]);
  const isAdmin = headerStore.get("x-is-admin") === "true";

  if (!users || !isAdmin) return null;
  return <UsersPage isAdmin={isAdmin} users={users} />;
}
