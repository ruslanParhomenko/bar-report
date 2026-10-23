"use client";

import { cn } from "@/lib/utils";
import { Ban } from "lucide-react";

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
  setIsShow: (isShow: boolean) => void;
  size?: number;
}) {
  return (
    <button
      type="button"
      onClick={() => setIsShow(!isShow)}
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
