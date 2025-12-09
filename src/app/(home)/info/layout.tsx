import NavMenuHeader from "@/components/nav-menu-header/NavMenuHeader";

const navItems = [
  { title: "standardKitchen", href: "standardKitchen" },
  { title: "statusMenu", href: "statusMenu" },
  { title: "staffMenu", href: "staffMenu" },
  { title: "dailyMenu", href: "daily-menu" },
  { title: "menuVip", href: "menuVip" },
];
export default function LayoutInfo({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavMenuHeader
        navItems={navItems}
        mainRoute={"info"}
        filterType="none"
        classNamePatch="md:w-36! w-16!"
        resetButton={true}
      />
      {children}
    </>
  );
}
