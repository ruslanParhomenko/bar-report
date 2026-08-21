"use client";

import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ChangeThemeButton({
  className,
  disabled = false,
  size = 18,
}: {
  className?: string;
  disabled?: boolean;
  size?: number;
}) {
  const { theme, setTheme } = useTheme();

  const onChangeTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  const ThemeIcon = theme === "dark" ? Sun : Moon;
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(className, "cursor-pointer")}
      onClick={() => onChangeTheme()}
    >
      <ThemeIcon size={size} className="text-bl" />
    </button>
  );
}
