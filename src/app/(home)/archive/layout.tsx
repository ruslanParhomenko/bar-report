import NavMenuArchive from "@/features/archive/NavMenuArchive";

export default function LayoutArchive({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavMenuArchive />
      {children}
    </>
  );
}
