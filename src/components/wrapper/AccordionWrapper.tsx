"use client";
import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useRef } from "react";
import { handleScrollTop } from "@/utils/handlerScrollTop";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

export default function AccordionWrapper({
  children,
  nameTag,
  className,
}: {
  children: React.ReactNode;
  nameTag: string;
  className?: string;
}) {
  const t = useTranslations("Home");
  const accordionRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentData = searchParams.get("data");

  const handleChange = (value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === nameTag) {
      params.set("data", nameTag);
      handleScrollTop({ accordionRef });
    } else {
      params.delete("data");
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div ref={accordionRef}>
      <Accordion
        type="single"
        collapsible
        value={currentData === nameTag ? nameTag : ""}
        onValueChange={handleChange}
        className="py-2"
      >
        <AccordionItem value={nameTag}>
          <AccordionTrigger className="text-base bg-bl cursor-pointer w-full px-4 py-2 hover:no-underline hover:text-amber-50">
            {t(nameTag)}
          </AccordionTrigger>

          <AccordionContent>
            <div className={cn("w-full md:p-2 py-2", className)}>
              {children}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
