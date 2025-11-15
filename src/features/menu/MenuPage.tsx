"use client";
import { useParams } from "next/navigation";
import { MenuNavBar } from "./MenuNavBar";
import { MenuVip } from "./MenuVip";
import { MenuStaff } from "./MenuStaff";
import { MenuDaily } from "./MenuDaily";

const COMPONENT_BY_PATCH = {
  bar: MenuVip,
  cuisine: MenuVip,
  "daily-menu": MenuDaily,
  "staff-menu": MenuStaff,
};

export function MenuPage() {
  const { patch } = useParams();
  const Component =
    COMPONENT_BY_PATCH[patch as keyof typeof COMPONENT_BY_PATCH];

  return (
    <>
      <MenuNavBar />
      {Component && <Component />}
    </>
  );
}
