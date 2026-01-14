import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import UsersPage from "@/features/users/users-page";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function Page() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "ADMIN" ? (
    <UsersPage />
  ) : (
    <InsufficientRights />
  );
}
