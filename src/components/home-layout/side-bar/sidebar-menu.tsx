import LinkNav from "@/components/buttons/link-nav";
import { SIDEBAR_NAVIGATION } from "@/components/home-layout/side-bar/constants";
import { SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar";
import { ADMIN } from "@/constants/roles";
import { COOKIE_NAME_TABS_PREFIX } from "@/constants/tabs";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";

export default async function SidebarMenuButtons() {
  const session = await getServerSession(authOptions);
  const isAdmin = session && session.user.role === ADMIN;
  const accessList = session?.user.accessList || [];

  const store = await cookies();
  const savedTabs = Object.fromEntries(
    store
      .getAll()
      .filter((c) => c.name.startsWith(COOKIE_NAME_TABS_PREFIX))
      .map((c) => [c.name.slice(COOKIE_NAME_TABS_PREFIX.length), c.value]),
  );

  return (
    <SidebarMenu className="flex h-full flex-col gap-1.5">
      {SIDEBAR_NAVIGATION.filter(
        (item) => accessList.includes(item.title) || isAdmin,
      ).map((item) => {
        const Icon = item.icon;

        return (
          <SidebarMenuButton key={item.title} asChild>
            <LinkNav
              title={item.title}
              query={item.query}
              defaultTab={savedTabs[item.title]}
            >
              {Icon && <Icon size={16} className="text-bl" />}
            </LinkNav>
          </SidebarMenuButton>
        );
      })}
    </SidebarMenu>
  );
}
