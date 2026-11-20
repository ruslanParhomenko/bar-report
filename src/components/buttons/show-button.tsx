"use client";

import snow_2 from "@/../public/snow_2.png";
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
  setIsShow: (isShow: boolean, theme?: string) => void;
  size?: number;
}) {
  return (
    <button
      type="button"
      onClick={() => setIsShow(!isShow)}
      className={cn(
        className,
        "h-6.5 w-10.5 cursor-pointer border-0 bg-transparent bg-contain bg-center bg-no-repeat hover:text-black",
        disabled && "opacity-50",
      )}
      disabled={disabled}
      style={{
        backgroundImage: !isShow ? `url("${snow_2.src}")` : "none",
      }}
    >
      {isShow && <Ban size={size} className="text-rd" strokeWidth={1.5} />}
    </button>
  );
}
