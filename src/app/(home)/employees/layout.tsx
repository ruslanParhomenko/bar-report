import NavMenuHeader from "@/components/nav-menu-header/NavMenuHeader";
const navItems = [
  { title: "employees", href: "" },
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
        mainRoute={"employees"}
        filterType="role"
      />

      {children}
    </>
  );
}
