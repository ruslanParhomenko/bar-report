import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function Page() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  return (
    <div className="text-rd flex h-full items-center justify-center">
      {role}
    </div>
  );
}
