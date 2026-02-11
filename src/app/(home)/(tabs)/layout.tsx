import NavTabs from "@/components/nav/nav-tabs";

export default function NavTabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NavTabs>{children}</NavTabs>;
}
