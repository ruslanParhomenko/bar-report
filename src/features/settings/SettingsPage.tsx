import { WrapperAccordionTable } from "../info/WrapperAccardionTable";
import AddEmployees from "./emploees/AddEmployees";
import AddUsers from "./users/AddUsers";

export default function SettingsPage() {
  return (
    <>
      <WrapperAccordionTable nameTag="users" className="md:flex-row">
        <AddUsers />
      </WrapperAccordionTable>
      <WrapperAccordionTable nameTag="employees" className="md:flex-row">
        <AddEmployees />
      </WrapperAccordionTable>
    </>
  );
}
