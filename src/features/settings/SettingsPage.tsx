import AccordionWrapper from "@/components/wrapper/AccordionWrapper";
import AddEmployees from "./emploees/AddEmployees";
import AddUsers from "./users/AddUsers";

export default function SettingsPage() {
  return (
    <>
      <AccordionWrapper nameTag="users" className="md:flex-row">
        <AddUsers />
      </AccordionWrapper>
      <AccordionWrapper nameTag="employees" className="md:flex-row">
        <AddEmployees />
      </AccordionWrapper>
    </>
  );
}
