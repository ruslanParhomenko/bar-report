"use client";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";

export default function SidebarHeader({
  session,
}: {
  session: Session | null;
}) {
  const router = useRouter();
  const role = session?.user?.role;
  return (
    <div
      className="text-rd flex h-8 cursor-pointer items-center justify-center text-xs"
      onClick={() => router.push("/home")}
    >
      {role?.toLocaleLowerCase()}
    </div>
  );
}
