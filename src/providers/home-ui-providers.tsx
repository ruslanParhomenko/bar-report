"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import ClientRefProvider from "@/providers/client-ref-provider";
import MonthDaysProvider from "@/providers/month-days-provider";
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
          <MonthDaysProvider>{children}</MonthDaysProvider>
        </ClientRefProvider>
      </EditProvider>
    </SidebarProvider>
  );
}
