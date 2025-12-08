import NavMenuHeader from "@/components/nav-menu-header/NavMenuHeader";

const navItems = [
  { title: "bar", href: "bar" },
  { title: "cucina", href: "cucina" },
];
export default function LayoutArchive({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavMenuHeader
        navItems={navItems}
        mainRoute={"archive"}
        filterType="month"
        resetButton={true}
      />
      {children}
    </>
  );
}
