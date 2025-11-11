import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import { PageCash } from "@/features/cash/PageCash";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const SET_ACCESS = ["ADMIN", "CASH"];

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  const role = session?.user?.role;
  if (!SET_ACCESS.includes(role as string)) return <InsufficientRights />;

  return <PageCash />;
}
