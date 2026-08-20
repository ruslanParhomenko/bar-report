"use client";
import { SIDEBAR_NAVIGATION } from "@/components/sidebar/constants";
import {
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function SidebarMenuButtons({
  isAdmin,
  accessList,
}: {
  isAdmin: boolean;
  accessList: string[];
}) {
  const pathname = usePathname();
  const t = useTranslations("Sidebar");
  const { toggleSidebar, isMobile } = useSidebar();

  const handleMenuClick = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  return (
    <SidebarMenu className="flex h-full flex-col gap-3 pt-2">
      {SIDEBAR_NAVIGATION.filter(
        (item) => accessList.includes(item.url) || isAdmin,
      ).map((item) => {
        const isActivePath = pathname.split("/")[1] === item.url;
        const Icon = item.icon;

        return (
          <SidebarMenuButton
            key={item.title}
            asChild
            className={cn(
              "rounded-none hover:bg-gray-200",
              isActivePath &&
                "text-rd [&>span]:text-rd [&>svg]:text-rd bg-white",
            )}
          >
            <Link
              href={`/${item.url}`}
              onClick={handleMenuClick}
              className={cn("flex w-full cursor-default items-center")}
            >
              <Icon className="text-bl" />
              <span className="text-bl ml-1">{t(item.title)}</span>
            </Link>
          </SidebarMenuButton>
        );
      })}
    </SidebarMenu>
  );
}
