import NavMenuTips from "@/features/tips/NavMenuTips";
import { Nav } from "react-day-picker";

export default function TipsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavMenuTips />
      {children}
    </>
  );
}
