"use client";
import { useSession } from "next-auth/react";

export default function RoleUser() {
  const { data } = useSession();

  const role = data?.user.role;

  return (
    <div className="text-rd flex justify-center text-xs">
      {role?.toLocaleLowerCase()}
    </div>
  );
}
