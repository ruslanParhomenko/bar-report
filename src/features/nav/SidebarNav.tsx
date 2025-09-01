"use client";

import { LogOut } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
} from "../../components/ui/sidebar";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "../../components/switches/LanguageSwitch";
import { SIDEBAR_NAVIGATION } from "./constants";
import { useSidebar } from "../../components/ui/sidebar";
import { SidebarToggleButton } from "@/components/switches/SidebarToggleButton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAbility } from "@/providers/AbilityProvider";

const SidebarNav = () => {
  const { toggleSidebar, isMobile } = useSidebar();
  const pathname = usePathname();
  const t = useTranslations("Home");
  const { isAdmin, isBar, isCucina, isUser } = useAbility();

  const handleMenuClick = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  const roleLabel = isAdmin
    ? "ADMIN"
    : isBar
    ? "BAR"
    : isCucina
    ? "CUCINA"
    : isUser
    ? "USER"
    : "OBSERVER";

  return (
    <>
      <div className="flex items-center lg:hidden">
        <SidebarToggleButton />
      </div>
      <Sidebar className="border-none">
        <SidebarContent>
          <div className="flex justify-center pt-2">
            <Avatar className="w-full">
              <AvatarFallback>{roleLabel}</AvatarFallback>
            </Avatar>
          </div>
          <SidebarMenu className="flex h-full flex-col gap-4 pt-5">
            {SIDEBAR_NAVIGATION.map((item) => {
              const isActivePath =
                pathname.split("/")[1] === item.url.split("/")[1];

              return (
                <SidebarMenuButton key={item.title} asChild>
                  <Link
                    href={isCucina ? item.url2 : item.url}
                    onClick={handleMenuClick}
                    className={cn(" flex items-center w-full p-4 rounded-md", {
                      "bg-[#1DA1F2]! text-[#000000] hover:bg-[#211df2]  [&>span]:text-[#ffff]":
                        isActivePath,
                    })}
                  >
                    <span className="text-base">{t(item.title)}</span>
                  </Link>
                </SidebarMenuButton>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="pb-20">
          <SidebarMenu className="flex flex-row justify-between items-center gap-4 px-6">
            <div
              className="cursor-pointer"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="rotate-180 text-[#2563EB]" />
            </div>
            <LanguageSwitcher />
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  );
};

export default SidebarNav;
