import NavMenuHeader from "@/components/nav-menu-header/NavMenuHeader";

const navItems = [
  { title: "details", href: "details" },
  { title: "general", href: "general" },
];

export default function LayoutResult({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavMenuHeader
        defaultPatch="details"
        navItems={navItems}
        mainRoute="penalty"
        filterType="month"
      />
      {children}
    </>
  );
}
