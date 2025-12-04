import TabsNavEmployees from "@/features/employees/TabsNavEmployees";

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
