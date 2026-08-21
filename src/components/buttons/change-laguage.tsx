"use client";

import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

export default function ChangeLanguageButton({
  className,
  disabled = false,
  size = 18,
}: {
  className?: string;
  disabled?: boolean;
  size?: number;
}) {
  const locale = useLocale();
  const router = useRouter();

  const onChangeLanguage = () => {
    const lang = locale === "ru" ? "ro" : "ru";
    document.cookie = `NEXT_LOCALE_BAR=${lang}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT;`;
    router.refresh();
  };

  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(className, "cursor-pointer")}
      onClick={() => onChangeLanguage()}
    >
      <Globe size={size} className="text-bl" />
    </button>
  );
}
