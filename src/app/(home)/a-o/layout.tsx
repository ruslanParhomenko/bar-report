import NavMenuHeader from "@/components/nav-menu-header/NavMenuHeader";

export default function LayoutCash({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavMenuHeader navItems={[]} mainRoute={"a-o"} filterType="month" />
      {children}
    </>
  );
}
