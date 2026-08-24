"use client";

import { Table } from "@/components/ui/table";
import { AnimatePresence, motion } from "motion/react";

import { useRef, useState } from "react";

import { useTabSwipeNavigation } from "@/hooks/use-tab-swipe-navigation";
import { useMobileTableScroll } from "../../schedule-edit/hooks/use-mobile-table-scroll";
import { getShiftCounts } from "../../schedule-edit/lib/utils";
import { GetScheduleData } from "../../schedule-edit/model/type";
import ScheduleTableBody from "./schedule-body";
import ScheduleTableFooter from "./schedule-footer";
import ScheduleTableHeader from "./schedule-header";

type Props = {
  schedule: GetScheduleData | null;
  tab: string;
  isAdmin: boolean;
};

export function ScheduleView({ schedule, tab, isAdmin }: Props) {
  const todayDay = new Date().getDate();
  const [selectedDay, setSelectedDay] = useState<number>(todayDay);

  const rowShifts = schedule?.rowShifts;
  const shiftCounts = getShiftCounts(rowShifts ?? []);

  const { handlers } = useTabSwipeNavigation();

  const refCell = useRef<HTMLTableElement>(null!);
  useMobileTableScroll(refCell, tab ?? "");

  if (!schedule) {
    return (
      <div className="mt-4">
        <p className="text-center">No schedule found</p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        {...handlers}
        key={schedule.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <Table ref={refCell} className="mt-4 table-fixed">
          <ScheduleTableHeader
            addNewRow={() => {}}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
          />
          <ScheduleTableBody
            schedule={schedule}
            selectedDay={selectedDay}
            isAdmin={isAdmin}
          />

          <ScheduleTableFooter shiftCounts={shiftCounts} role={tab as string} />
        </Table>
      </motion.div>
    </AnimatePresence>
  );
}
