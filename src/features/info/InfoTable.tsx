import { EmployeesListTable } from "./EmployeesListTable";
import { StandardKitchenTable } from "./StandardKitchenTable";
import MeniuRatingTable from "./MeniuRatingTable";

import StatusMenu from "./StatusMenu";
import AccordionWrapper from "@/components/wrapper/AccordionWrapper";

export default function InfoTable() {
  return (
    <>
      <AccordionWrapper nameTag="employees">
        <EmployeesListTable />
      </AccordionWrapper>
      <AccordionWrapper nameTag="standardKitchen">
        <StandardKitchenTable />
      </AccordionWrapper>
      <AccordionWrapper nameTag="meniuRating">
        <MeniuRatingTable />
      </AccordionWrapper>
      <AccordionWrapper nameTag="StatusMenu">
        <StatusMenu />
      </AccordionWrapper>
    </>
  );
}
