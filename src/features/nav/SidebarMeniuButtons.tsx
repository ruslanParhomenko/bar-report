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

  const styleIcon = {
    width: "20px",
    height: "20px",
  };
  return (
    <SidebarMenu className="flex h-full flex-col gap-4 pt-2">
      {SIDEBAR_NAVIGATION.map((item) => {
        const isActivePath = pathname.split("/")[1] === item.url.split("/")[1];
        const Icon = item.icon;

        return (
          <SidebarMenuButton key={item.title} asChild>
            <Link
              href={item.url}
              onClick={handleMenuClick}
              className={cn("flex items-center w-full", {
                "bg-bl text-base [&>span]:text-[#ffff]": isActivePath,
              })}
            >
              <Icon
                className={isActivePath ? "text-[#000000]" : "text-bl"}
                style={styleIcon}
              />
              <span className="ml-2">{t(item.title)}</span>
            </Link>
          </SidebarMenuButton>
        );
      })}
    </SidebarMenu>
  );
}
