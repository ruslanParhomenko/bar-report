"use client";
import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useRef } from "react";
import { handleScrollTop } from "@/features/archive/helpers";

export default function AccordionWrapper({
  children,
  nameTag,
}: {
  children: React.ReactNode;
  nameTag: string;
}) {
  const t = useTranslations("Home");
  const accordionRef = useRef<HTMLDivElement>(null);
  return (
    <Accordion type="single" collapsible className="py-2">
      <div ref={accordionRef}>
        <AccordionItem value={nameTag}>
          <AccordionTrigger
            onClick={() => {
              handleScrollTop({ accordionRef });
            }}
            className="text-base bg-bl cursor-pointer w-full px-4 py-2 hover:no-underline hover:text-amber-50"
          >
            {t(nameTag as string)}
          </AccordionTrigger>
          <AccordionContent>{children}</AccordionContent>
        </AccordionItem>
      </div>
    </Accordion>
  );
}
