"use client";

import Header from "@/components/meniu/Header";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="antialiased  min-h-screen md:max-w-[480px] w-full relative mx-auto md:px-2 pb-4">
      <Header />
      {children}
    </div>
  );
}
