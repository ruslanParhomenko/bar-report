"use client";
import {
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { SIDEBAR_NAVIGATION } from "./constants";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function SidebarMenuButtons() {
  const pathname = usePathname();
  const t = useTranslations("Home");
  const { toggleSidebar, isMobile } = useSidebar();

  const handleMenuClick = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  return (
    <SidebarMenu className="flex h-full flex-col gap-4 pt-2">
      {SIDEBAR_NAVIGATION.map((item) => {
        const isActivePath = pathname.split("/")[1] === item.url;
        const Icon = item.icon;

        return (
          <SidebarMenuButton key={item.title} asChild>
            <Link
              href={`/${item.url}`}
              onClick={handleMenuClick}
              className={cn(
                "flex items-center w-full",
                isActivePath && "bg-bl",
              )}
            >
              <Icon className={isActivePath ? "" : "text-bl"} />
              <span className={cn("ml-2", isActivePath ? "" : "text-bl")}>
                {t(item.title)}
              </span>
            </Link>
          </SidebarMenuButton>
        );
      })}
    </SidebarMenu>
  );
}
