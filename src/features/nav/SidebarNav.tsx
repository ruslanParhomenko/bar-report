"use client";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { signOut } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
} from "../../components/ui/sidebar";
import { cn } from "@/lib/utils";

import { SIDEBAR_NAVIGATION } from "./constants";
import { useSidebar } from "../../components/ui/sidebar";
import { SidebarToggleButton } from "@/components/switches/SidebarToggleButton";
import { useAbility } from "@/providers/AbilityProvider";

import { Globe, MoonStars, SignOut, Sun } from "phosphor-react";
import { useTheme } from "next-themes";

const SidebarNav = () => {
  const locale = useLocale();
  const router = useRouter();

  const { theme, setTheme } = useTheme();

  const { toggleSidebar, isMobile } = useSidebar();
  const pathname = usePathname();
  const t = useTranslations("Home");
  const { isAdmin, isBar, isCucina, isUser } = useAbility();

  const handleMenuClick = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };
  const changeLanguage = () => {
    const lang = locale === "ru" ? "ro" : "ru";
    document.cookie = `NEXT_LOCALE_BAR=${lang}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT;`;
    router.refresh();
  };

  const roleLabel = isAdmin
    ? "admin"
    : isBar
    ? "bar"
    : isCucina
    ? "cucina"
    : isUser
    ? "user"
    : "observer";

  return (
    <>
      <div className="flex items-center lg:hidden">
        <SidebarToggleButton />
      </div>
      <Sidebar className="border-none">
        <SidebarContent>
          <div className="flex justify-center  text-rd">{roleLabel}</div>
          <SidebarMenu className="flex h-full flex-col gap-4">
            {SIDEBAR_NAVIGATION.map((item) => {
              const isActivePath =
                pathname.split("/")[1] === item.url.split("/")[1];
              const Icon = item.icon;

              return (
                <SidebarMenuButton key={item.title} asChild>
                  <Link
                    href={isCucina ? item.url2 : item.url}
                    onClick={handleMenuClick}
                    className={cn("flex items-center w-full", {
                      "bg-bl! text-base hover:bg-bl  [&>span]:text-[#ffff]":
                        isActivePath,
                    })}
                  >
                    <Icon
                      className={cn("text-bl", {
                        "text-[#000000]": isActivePath,
                      })}
                      style={{ width: "18px", height: "18px" }}
                    />
                    <span className="ml-2">{t(item.title)}</span>
                  </Link>
                </SidebarMenuButton>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu className="flex flex-row  w-full items-center  gap-2">
            <>
              <SidebarMenuButton
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun
                    style={{ width: "18px", height: "18px" }}
                    className={cn("text-bl")}
                  />
                ) : (
                  <MoonStars
                    style={{ width: "18px", height: "18px" }}
                    className="text-bl"
                  />
                )}
              </SidebarMenuButton>
              <SidebarMenuButton onClick={changeLanguage}>
                <Globe className="text-bl size-6 transition duration-300 ease-in-out hover:scale-110 hover:text-bl" />
              </SidebarMenuButton>

              <SidebarMenuButton asChild>
                <Link
                  href={"/"}
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className={cn("flex items-center w-full")}
                >
                  <SignOut
                    style={{ width: "18px", height: "18px" }}
                    className="text-bl"
                  />
                </Link>
              </SidebarMenuButton>
            </>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  );
};

export default SidebarNav;
