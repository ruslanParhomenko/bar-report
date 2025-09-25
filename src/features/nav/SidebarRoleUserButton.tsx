"use client";
import { useAbility } from "@/providers/AbilityProvider";

export default function SidebarRoleUserButton() {
  const { isAdmin, isBar, isCucina, isUser } = useAbility();

  const roleLabel = isAdmin
    ? "admin"
    : isBar
    ? "bar"
    : isCucina
    ? "cucina"
    : isUser
    ? "user"
    : "observer";
  return (
    <div className="flex justify-center text-xs py-2  text-rd">{roleLabel}</div>
  );
}
