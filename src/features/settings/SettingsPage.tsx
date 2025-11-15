import AccordionWrapper from "@/components/wrapper/AccordionWrapper";
import { UsersPage } from "./users/UsersPage";

export default function SettingsPage() {
  return (
    <AccordionWrapper nameTag="users" className="md:flex-row">
      <UsersPage />
    </AccordionWrapper>
  );
}
