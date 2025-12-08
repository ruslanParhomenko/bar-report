import NavMenuHeader from "@/components/nav-menu-header/NavMenuHeader";

export default function TipsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavMenuHeader navItems={[]} mainRoute={"tips"} filterType="month" />
      {children}
    </>
  );
}
