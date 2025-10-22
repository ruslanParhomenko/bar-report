"use client";
import { ScheduleType } from "@/features/settings/schedule/schema";
import { createContext, useContext } from "react";

export type SchedulesContextValue = ScheduleType & {
  id: string;
  uniqueKey: string;
};

const SchedulesContext = createContext<SchedulesContextValue[]>([]);

export function SchedulesProvider({
  schedules,
  children,
}: {
  schedules: SchedulesContextValue[];
  children: React.ReactNode;
}) {
  return (
    <SchedulesContext.Provider value={schedules}>
      {children}
    </SchedulesContext.Provider>
  );
}

export const useSchedules = () => useContext(SchedulesContext);
