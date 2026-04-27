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
    <div className="flex-1" ref={ref} data-screenshot-root="true">
      {children}
    </div>
  );
}
