import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import { GetUsersCard } from "@/features/users/GetUsers";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function Page() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "ADMIN" ? (
    <GetUsersCard />
  ) : (
    <InsufficientRights />
  );
}
