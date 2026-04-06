"use client";
import {
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { SIDEBAR_NAVIGATION } from "@/constants/sidebar-nav";

export default function SidebarMenuButtons() {
  const pathname = usePathname();
  const t = useTranslations("Sidebar");
  const { toggleSidebar, isMobile } = useSidebar();

  const handleMenuClick = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  const { data: session, status } = useSession();
  if (status === "loading") {
    return null;
  }
  const role = (session?.user as any)?.role ?? "OBSERVER";

  return (
    <SidebarMenu className="flex h-full flex-col gap-4 pt-2">
      {SIDEBAR_NAVIGATION.filter((item) => item.setAcces.includes(role)).map(
        (item) => {
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
        },
      )}
    </SidebarMenu>
  );
}
