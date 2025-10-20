import AccordionWrapper from "@/components/wrapper/AccordionWrapper";
import AddEmployees from "./emploees/AddEmployees";
import AddUsers from "./users/AddUsers";
import { ScheduleTable } from "./schedule/AddSchedule";

export default function SettingsPage() {
  return (
    <>
      <AccordionWrapper nameTag="users" className="md:flex-row">
        <AddUsers />
      </AccordionWrapper>
      <AccordionWrapper nameTag="employees" className="md:flex-row">
        <AddEmployees />
      </AccordionWrapper>
      <AccordionWrapper nameTag="schedule" className="md:flex-row">
        <ScheduleTable />
      </AccordionWrapper>
    </>
  );
}
