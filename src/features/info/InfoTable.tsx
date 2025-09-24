"use client";
import { useTranslations } from "next-intl";
import { EmployeesListTable } from "./EmployeesListTable";
import { UserListTable } from "./UserListTable";
import { StandardKitchenTable } from "./StandardKitchenTable";
import MeniuRatingTable from "./MeniuRatingTable";
import { WrapperAccordionTable } from "./WrapperAccardionTable";

export default function InfoTable() {
  const t = useTranslations("Home");

  return (
    <>
      <WrapperAccordionTable nameTag="employees">
        <EmployeesListTable />
      </WrapperAccordionTable>
      <WrapperAccordionTable nameTag="users">
        <UserListTable />
      </WrapperAccordionTable>
      <WrapperAccordionTable nameTag="standardKitchen">
        <StandardKitchenTable />
      </WrapperAccordionTable>
      <WrapperAccordionTable nameTag="meniuRating">
        <MeniuRatingTable />
      </WrapperAccordionTable>
    </>
  );
}
