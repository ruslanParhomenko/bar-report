"use client";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useRouter } from "@/i18n/navigation";
import { Globe, LogOut, Moon, Sun } from "lucide-react";
import { signOut } from "next-auth/react";
import { useLocale } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function SidebarFooterButtons() {
  const locale = useLocale();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const changeLanguage = () => {
    const lang = locale === "ru" ? "ro" : "ru";
    document.cookie = `NEXT_LOCALE_BAR=${lang}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT;`;
    router.refresh();
  };

  const changeTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const styleIcon = {
    width: "20px",
    height: "20px",
  };

  if (!mounted) {
    return null;
  }

  const ThemeIcon = theme === "dark" ? Sun : Moon;

  return (
    <SidebarFooter>
      <SidebarMenu className="flex flex-row  w-full items-center  gap-1 pb-2">
        <SidebarMenuButton onClick={() => changeTheme()}>
          <ThemeIcon style={styleIcon} className="text-bl" />
        </SidebarMenuButton>
        <SidebarMenuButton onClick={changeLanguage}>
          <Globe style={styleIcon} className="text-bl" />
        </SidebarMenuButton>
        <SidebarMenuButton onClick={() => signOut({ callbackUrl: "/" })}>
          <LogOut style={styleIcon} className="text-bl" />
        </SidebarMenuButton>
      </SidebarMenu>
    </SidebarFooter>
  );
}
