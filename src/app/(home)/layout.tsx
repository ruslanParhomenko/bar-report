import SidebarNav from "@/features/nav/SidebarNav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import { redirect } from "next/navigation";

const NavPage = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  const role = session?.user?.role;
  return (
    <SidebarProvider>
      <SidebarNav />
      <section className="bg-background pt-2 md:px-4 px-1 w-full ">
        {role === "OBSERVER" ? <InsufficientRights /> : children}
      </section>
    </SidebarProvider>
  );
};

export default NavPage;
