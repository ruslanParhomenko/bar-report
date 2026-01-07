import NavMenuHeader from "@/components/nav-menu-header/NavMenuHeader";

const navItems = [
  { title: "day", href: "day" },
  { title: "month", href: "month" },
  { title: "year", href: "year" },
];

export default function LayoutCash({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavMenuHeader
        navItems={navItems}
        mainRoute={"ttn"}
        filterType="month"
        defaultPatch="month"
        resetButton={true}
      />
      {children}
    </>
  );
}
