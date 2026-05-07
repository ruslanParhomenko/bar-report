"use client";

import { ViewTransition } from "react";

export default function ViewTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ViewTransition>{children}</ViewTransition>;
}
