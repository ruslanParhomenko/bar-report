"use client";
import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EmployeesListTable } from "./EmployeesListTable";
import { UserListTable } from "./UserListTable";
import { StandardKitchenTable } from "./StandardKitchenTable";
import MeniuRatingTable from "./MeniuRatingTable";

export default function InfoTable() {
  const t = useTranslations("Home");
  return (
    <div className="flex flex-col gap-4">
      <Accordion type="single" collapsible>
        <AccordionItem value="employees">
          <AccordionTrigger className="text-lg cursor-pointer w-full [&>svg]:hidden bg-blue-400 px-4 py-2 hover:bg-blue-600  no-underline! focus:no-underline">
            {t("employees")}
          </AccordionTrigger>
          <AccordionContent>
            <EmployeesListTable />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible>
        <AccordionItem value="users">
          <AccordionTrigger className="text-lg cursor-pointer w-full [&>svg]:hidden bg-blue-400 px-4 py-2 hover:bg-blue-600  no-underline! focus:no-underline">
            {t("users")}
          </AccordionTrigger>
          <AccordionContent>
            <UserListTable />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible>
        <AccordionItem value="users">
          <AccordionTrigger className="text-lg cursor-pointer w-full [&>svg]:hidden bg-blue-400 px-4 py-2 hover:bg-blue-600  no-underline! focus:no-underline">
            {t("standardKitchen")}
          </AccordionTrigger>
          <AccordionContent>
            <StandardKitchenTable />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible>
        <AccordionItem value="users">
          <AccordionTrigger className="text-lg cursor-pointer w-full [&>svg]:hidden bg-blue-400 px-4 py-2 hover:bg-blue-600  no-underline! focus:no-underline">
            {t("meniuRating")}
          </AccordionTrigger>
          <AccordionContent>
            <MeniuRatingTable />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
