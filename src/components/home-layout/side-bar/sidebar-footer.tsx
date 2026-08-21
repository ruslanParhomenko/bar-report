import ChangeLanguageButton from "@/components/buttons/change-laguage";
import ChangeThemeButton from "@/components/buttons/change-theme";
import LogOutButton from "@/components/buttons/logout-button";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export default function SidebarFooterButtons() {
  return (
    <SidebarFooter>
      <SidebarMenu className="flex w-full flex-row items-center gap-3">
        <SidebarMenuButton asChild>
          <ChangeThemeButton />
        </SidebarMenuButton>
        <SidebarMenuButton asChild>
          <ChangeLanguageButton />
        </SidebarMenuButton>
        <SidebarMenuButton asChild>
          <LogOutButton />
        </SidebarMenuButton>
      </SidebarMenu>
    </SidebarFooter>
  );
}
