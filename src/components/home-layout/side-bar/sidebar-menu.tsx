"use client";
import { SIDEBAR_NAVIGATION } from "@/components/home-layout/side-bar/constants";
import {
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { MONTHS } from "@/utils/get-month-days";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function SidebarMenuButtons({
  isAdmin,
  accessList,
}: {
  isAdmin: boolean;
  accessList: string[];
}) {
  const pathname = usePathname();
  const params = new URLSearchParams();
  const t = useTranslations("Sidebar");
  const { toggleSidebar, isMobile } = useSidebar();

  const date = new Date();
  const month = MONTHS[date.getMonth()];
  const year = date.getFullYear().toString();

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

        const queryTabs = item.query?.tabs[0];
        const queryDate = item.query?.selectDate;

        if (queryTabs) {
          params.set("tab", queryTabs);
        } else {
          params.delete("tab");
        }

        if (queryDate) {
          params.set("month", month);
          params.set("year", year);
        } else {
          params.delete("month");
          params.delete("year");
        }

        const href = `/${item.url}?${params.toString()}`;

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
              href={href}

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
