import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useTranslations } from "next-intl";
import { PageNavType } from "./NavMenuHeader";

export default function SelectTabsByPatch({
  patch,
  setPatch,
  isPending,
  navItems,
  classNamePatch,
}: {
  patch: string;
  setPatch: (value: string) => void;
  isPending: boolean;
  navItems: PageNavType[];
  classNamePatch?: string;
}) {
  const t = useTranslations("Home");
  return (
    <Tabs
      value={patch}
      onValueChange={(value) => setPatch(value)}
      className="order-1 md:order-0"
    >
      <TabsList className="flex md:gap-2 h-8">
        {navItems.map((page) => (
          <TabsTrigger
            key={page.title}
            value={page.href}
            disabled={isPending}
            className={cn(
              "md:w-24 w-22 hover:text-bl cursor-pointer",
              isPending && "opacity-50",
              classNamePatch
            )}
          >
            {t(page.title)}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
