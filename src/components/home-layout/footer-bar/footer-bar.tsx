"use client";

import ActionButtons from "@/components/home-layout/footer-bar/action-buttons";
import SelectTabs from "@/components/home-layout/header-bar/select-tabs";

import { useIsMobile } from "@/hooks/use-mobile";
import { useTabSwipeNavigation } from "@/hooks/use-tab-swipe-navigation";
import { useSearchParams } from "next/navigation";

export default function ActionBar({ isAdmin }: { isAdmin: boolean }) {
  const tab = useSearchParams().get("tab") || "";
  const isMobile = useIsMobile();
  const { handlers } = useTabSwipeNavigation();

  if (!isMobile) {
    return <ActionButtons isAdmin={isAdmin} tab={tab} />;
  }

  if (!tab) {
    return null;
  }

  return (
    <div className="py-2" {...handlers}>
      <SelectTabs urlTab={tab} />
    </div>
  );
}
