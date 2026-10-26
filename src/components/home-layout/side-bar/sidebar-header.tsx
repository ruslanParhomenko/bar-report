"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SidebarHeader() {
  const session = useSession();
  const router = useRouter();
  const role = session.data?.user?.role;
  return (
    <div
      className="text-rd flex h-8 cursor-pointer items-center justify-center text-xs"
      onClick={() => router.push("/home")}
    >
      {role?.toLocaleLowerCase()}
    </div>
  );
}
