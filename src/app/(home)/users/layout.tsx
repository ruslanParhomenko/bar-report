import NavMenuHeader from "@/components/nav-menu-header/NavMenuHeader";
const navItems = [
  { title: "users", href: "" },
  { title: "add", href: "create" },
];

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavMenuHeader
        navItems={navItems}
        mainRoute={"users"}
        filterType="none"
      />

      {children}
    </>
  );
}
