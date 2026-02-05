import NavPatch from "@/components/nav/nav-patch";
import { Suspense } from "react";

export default async function DataPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col p-1 w-full">
      <Suspense fallback={<div>Loading...</div>}>
        <NavPatch />
      </Suspense>
      {children}
    </div>
  );
}
