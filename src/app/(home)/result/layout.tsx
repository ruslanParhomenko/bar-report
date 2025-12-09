import NavMenuHeader from "@/components/nav-menu-header/NavMenuHeader";

const navItems = [
  { title: "barmen", href: "barmen" },
  { title: "waiters", href: "waiters" },
  { title: "cucina", href: "cucina" },
  { title: "dish", href: "dish" },
];

export default function LayoutResult({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavMenuHeader
        navItems={navItems}
        mainRoute={"result"}
        filterType="month"
        resetButton={true}
        classNamePatch="w-15"
      />
      {children}
    </>
  );
}
