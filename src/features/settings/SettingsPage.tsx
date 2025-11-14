import AccordionWrapper from "@/components/wrapper/AccordionWrapper";
import AddUsers from "./users/AddUsers";

export default function SettingsPage() {
  return (
    <>
      <AccordionWrapper nameTag="users" className="md:flex-row">
        <AddUsers />
      </AccordionWrapper>
    </>
  );
}
