"use client";

import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";

export default function LogOutButton({
  className,
  disabled = false,
  size = 18,
}: {
  className?: string;
  disabled?: boolean;
  size?: number;
}) {
  const { theme, setTheme } = useTheme();

  const onLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(className, "cursor-pointer")}
      onClick={() => onLogout()}
    >
      <LogOut size={size} className="text-bl" />
    </button>
  );
}
