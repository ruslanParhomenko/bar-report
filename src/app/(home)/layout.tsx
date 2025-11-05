import SidebarNav from "@/features/nav/SidebarNav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";

const NavPage = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  return (
    <SidebarProvider>
      <SidebarNav />
      <section className="bg-background py-2 px-4 w-full ">
        {role === "OBSERVER" ? <InsufficientRights /> : children}
      </section>
    </SidebarProvider>
  );
};

export default NavPage;
