import { SidebarProvider } from "@/components/ui/sidebar";
import ClientRefProvider from "@/providers/client-ref-provider";
import EditProvider from "./edit-provider";

export default function HomeUIProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <EditProvider>
        <ClientRefProvider>
          {children}
        </ClientRefProvider>
      </EditProvider>
    </SidebarProvider>
  );
}
