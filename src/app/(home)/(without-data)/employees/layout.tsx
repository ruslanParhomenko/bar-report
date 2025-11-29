import TabsNavEmployees from "@/features/nav/TabsNavEmployees";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TabsNavEmployees />

      {children}
    </>
  );
}
