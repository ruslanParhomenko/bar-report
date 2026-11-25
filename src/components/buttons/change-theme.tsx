"use client";

import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ChangeThemeButton({
  className,
  disabled = false,
  size = 18,
}: {
  className?: string;
  disabled?: boolean;
  size?: number;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onChangeTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const ThemeIcon = resolvedTheme === "dark" ? Sun : Moon;

  return (
    <button
      type="button"
      disabled={disabled || !mounted}
      className={cn(className, "cursor-pointer")}
      onClick={onChangeTheme}
    >
      {mounted && <ThemeIcon size={size} className="text-bl" />}
    </button>
  );
}
