import NavMenuHeader from "@/components/nav-menu-header/NavMenuHeader";

const navItems = [
  { title: "bar", href: "bar" },
  { title: "cucina", href: "cucina" },
];
export default function LayoutStopList({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavMenuHeader
        navItems={navItems}
        mainRoute={"stop-list"}
        filterType="none"
        resetButton={true}
      />
      {children}
    </>
  );
}
