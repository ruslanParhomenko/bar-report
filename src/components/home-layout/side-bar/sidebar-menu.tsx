import LinkNav from "@/components/buttons/link-nav";
import { SIDEBAR_NAVIGATION } from "@/components/home-layout/side-bar/constants";
import { SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar";

export default function SidebarMenuButtons({
  isAdmin,
  accessList,
}: {
  isAdmin: boolean;
  accessList: string[];
}) {
  return (
    <SidebarMenu className="flex h-full flex-col gap-1">
      {SIDEBAR_NAVIGATION.filter(
        (item) => accessList.includes(item.title) || isAdmin,
      ).map((item) => {
        const Icon = item.icon;

        return (
          <SidebarMenuButton key={item.title} asChild>
            <LinkNav title={item.title} query={item.query}>
              {Icon && <Icon size={16} className="text-bl" />}
            </LinkNav>
          </SidebarMenuButton>
        );
      })}
    </SidebarMenu>
  );
}
