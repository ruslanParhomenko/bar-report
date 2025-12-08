import NavMenuHeader from "@/components/nav-menu-header/NavMenuHeader";

const navItems = [
  { title: "bar", href: "bar" },
  { title: "cucina", href: "cucina" },
];
export default function ReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavMenuHeader
        navItems={navItems}
        mainRoute={"reports"}
        filterType="none"
        resetButton={true}
      />
      {children}
    </>
  );
}
