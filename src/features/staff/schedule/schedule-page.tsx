"use client";

import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { useAccessCheck } from "@/hooks/use-tab-access";
import { useEdit } from "@/providers/edit-provider";
import { useSearchParams } from "next/navigation";

import { Employee } from "@/features/settings/create-employee/model/type";
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

  if (!hasAccess) {
    return <InsufficientRights />;
  }

  if (isEdit) {
    return <ScheduleEdit schedule={schedule} tab={tab} employees={employees} />;
  }

  return <ScheduleView schedule={schedule} tab={tab} isAdmin={isAdmin} />;
}
