import { UsersPage } from "@/features/users/users-page";
import { headers } from "next/headers";

export default async function Page() {
  const headerStore = await headers();
  const isAdmin = headerStore.get("x-is-admin") === "true";
  return <UsersPage isAdmin={isAdmin} />;
}
