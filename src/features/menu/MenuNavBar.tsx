"use client";
import { Link } from "@/i18n/navigation";
import { MENU_PAGE } from "./constants";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";

export function MenuNavBar() {
  const t = useTranslations("Menu");
  const { patch } = useParams();
  const { isMobile } = useSidebar();
  return (
    <div
      className={cn(
        patch
          ? "flex flex-row items-center justify-between py-4 sticky top-0 w-full"
          : "flex flex-col items-center gap-14 pt-40"
      )}
    >
      {MENU_PAGE.map((el, index) => (
        <button key={index}>
          <Link href={el.href}>
            <p
              className={cn(
                "rounded-md  border-transparent flex items-center justify-center bg-bl text-background  hover:bg-[#383838]",
                isMobile
                  ? "w-22 h-8 text-sm p-0 gap-1"
                  : patch
                  ? "w-30 h-8"
                  : "w-40 h-10"
              )}
            >
              {t(el.title)}
            </p>
          </Link>
        </button>
      ))}
    </div>
  );
}
