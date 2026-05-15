"use client";
import { RefContext } from "@/providers/client-ref-provider";
import { ReactNode, useContext } from "react";

export default function ScreenshotWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const ref = useContext(RefContext);

  return (
    <div
      className="min-h-0 flex-1 overflow-auto"
      ref={ref}
      data-screenshot-root="true"
    >
      {children}
    </div>
  );
}
