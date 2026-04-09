"use client";
import { useSession } from "next-auth/react";

export default function RoleUser() {
  const session = useSession();

  const role = session.data?.user.role;

  const ROLE_BY_ABILITY = {
    ADMIN: "admin",
    BAR: "bar",
    CUCINA: "cucina",
    USER: "user",
    MNGR: "mngr",
    CASH: "cash",
    FIN: "fin",
  };

  const roleLabel = ROLE_BY_ABILITY[role as keyof typeof ROLE_BY_ABILITY];

  return (
    <div className="flex justify-center text-xs py-2  text-rd">{roleLabel}</div>
  );
}
