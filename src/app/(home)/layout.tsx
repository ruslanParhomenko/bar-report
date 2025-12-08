import SidebarNav from "@/features/sidebar/SidebarNav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import { redirect } from "next/navigation";

const CLOSE_ACCESS = ["OBSERVER"];

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
        {CLOSE_ACCESS.includes(role as string) ? (
          <InsufficientRights />
        ) : (
          children
        )}
      </section>
    </SidebarProvider>
  );
};

export default NavPage;
