import NavRouter from "@/components/nav/nav-router";
import { Suspense } from "react";

export default async function FormPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col p-1">
      <Suspense fallback={<div>Loading...</div>}>
        <NavRouter />
      </Suspense>
      {children}
    </div>
  );
}
