import { StandardKitchenTable } from "./StandardKitchenTable";

import StatusMenu from "./StatusMenu";
import AccordionWrapper from "@/components/wrapper/AccordionWrapper";
import StaffMenu from "./StaffMenu";

export default function InfoTable() {
  return (
    <>
      <AccordionWrapper nameTag="standardKitchen">
        <StandardKitchenTable />
      </AccordionWrapper>
      <AccordionWrapper nameTag="StatusMenu">
        <StatusMenu />
      </AccordionWrapper>
      <AccordionWrapper nameTag="staffMenu">
        <StaffMenu />
      </AccordionWrapper>
    </>
  );
}
