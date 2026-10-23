"use client";

import { cn } from "@/lib/utils";
import { Ban } from "lucide-react";
import { useTheme } from "next-themes";

export default function ShowButton({
  className,
  disabled = true,
  isShow,
  setIsShow,
  size = 18,
}: {
  className?: string;
  disabled?: boolean;
  isShow: boolean;
  setIsShow: (isShow: boolean, theme?: string) => void;
  size?: number;
}) {
  const { setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => {
        setIsShow(!isShow);
        setTheme((theme) =>
          theme === "dark" ? (isShow ? "light" : "dark") : "dark",
        );
      }}
      className={cn(
        className,
        "h-7 w-10.5 cursor-pointer hover:text-black",
        disabled && "opacity-50",
        !isShow && "bg-rd",
      )}
      disabled={disabled}
    >
      {isShow && <Ban size={size} className="text-rd" strokeWidth={1.5} />}
    </button>
  );
}
