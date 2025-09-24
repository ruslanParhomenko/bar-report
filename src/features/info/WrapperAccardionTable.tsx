import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";

export function WrapperAccordionTable({
  children,
  nameTag,
}: {
  children: React.ReactNode;
  nameTag?: string;
}) {
  const t = useTranslations("Home");
  return (
    <Accordion type="single" collapsible className="py-2">
      <AccordionItem value={nameTag ?? ""}>
        <AccordionTrigger className="text-lg bg-bl cursor-pointer w-full  [&>svg]:hidden px-4 py-2 hover:no-underline hover:text-amber-50">
          {t(nameTag ?? "")}
        </AccordionTrigger>
        <AccordionContent>
          <div className="w-full md:w-2/3 mx-auto p-2 flex flex-col items-center space-y-4 ">
            {children}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
