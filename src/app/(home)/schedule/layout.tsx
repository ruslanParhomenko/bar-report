import NavMenuHeader from "@/components/nav-menu-header/NavMenuHeader";

const SCHEDULE_NAV_ITEMS = [
  { title: "cucina", href: "cucina" },
  { title: "bar", href: "bar" },
  { title: "dish", href: "dish" },
];

export default function ScheduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavMenuHeader
        navItems={SCHEDULE_NAV_ITEMS}
        mainRoute={"schedule"}
        filterType="month"
      />

      {children}
    </>
  );
}
