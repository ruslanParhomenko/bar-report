import NavTabs from "@/components/nav/nav-tabs";

export default function NavTabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col p-1 w-full">
      <NavTabs />
      {children}
    </div>
  );
}
