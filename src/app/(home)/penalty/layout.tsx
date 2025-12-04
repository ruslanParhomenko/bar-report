import NavMenuPenalty from "@/features/penalty/NavMenuPenalty";

export default function LayoutResult({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavMenuPenalty />
      {children}
    </>
  );
}
