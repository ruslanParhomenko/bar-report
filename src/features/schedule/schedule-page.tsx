"use client";

import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { useAccessCheck } from "@/hooks/use-tab-access";
import { useEdit } from "@/providers/edit-provider";
import { useSearchParams } from "next/navigation";

import { Employee } from "@/features/settings/create-employee/model/type";
import { useTabSwipeNavigation } from "@/hooks/use-tab-swipe-navigation";
import { AnimatePresence, motion } from "motion/react";
import { ScheduleEdit } from "./schedule-edit";
import { GetScheduleData } from "./schedule-edit/model/type";
import { ScheduleView } from "./schedule-view";

type Props = {
  schedules: GetScheduleData[] | null;
  employees: Employee[];
  isAdmin: boolean;
};

export function SchedulePage({ schedules, employees, isAdmin }: Props) {
  const hasAccess = useAccessCheck();
  const { isEdit } = useEdit();
  const searchParams = useSearchParams();

  const tab = searchParams.get("tab")!;

  const schedule = schedules?.find((s) => s.id === tab) ?? null;

  const { handlers } = useTabSwipeNavigation();

  if (!hasAccess) {
    return <InsufficientRights />;
  }
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        {...handlers}
        key={`${tab}-${isEdit ? "edit" : "view"}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.2,
          ease: "easeInOut",
        }}
        className="h-full"
      >
        {isEdit ? (
          <ScheduleEdit schedule={schedule} tab={tab} employees={employees} />
        ) : schedule ? (
          <ScheduleView schedule={schedule} tab={tab} isAdmin={isAdmin} />
        ) : (
          <div className="mt-4 flex h-[90dvh] items-center justify-center">
            <p className="text-center">No schedule found</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
