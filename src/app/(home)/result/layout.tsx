import NavMenuResult from "@/features/result/NavMenuResult";
export default function LayoutResult({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavMenuResult />
      {children}
    </>
  );
}
