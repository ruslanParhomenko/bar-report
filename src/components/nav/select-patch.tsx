import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useTranslations } from "next-intl";
import { PageNavType } from "./constants";

export default function SelectTabsByPatch({
  patch,
  setPatch,
  isPending,
  navItems,
}: {
  patch: string | null;
  setPatch: (value: string) => void;
  isPending: boolean;
  navItems: PageNavType[];
}) {
  const t = useTranslations("Home");
  const weighPath = navItems.length <= 2 ? "w-24" : "md:w-24 w-16";
  return (
    <Tabs
      value={patch || ""}
      onValueChange={(value) => setPatch(value)}
      className="order-3 md:order-0"
    >
      <TabsList className="flex md:gap-2 h-8">
        {navItems.map((page) => (
          <TabsTrigger
            key={page.title}
            value={page.href}
            disabled={isPending}
            className={cn(
              "hover:text-bl cursor-pointer",
              isPending && "opacity-50",
              weighPath,
            )}
          >
            <span className="truncate block w-full text-xs md:text-md text-bl">
              {t(page.title)}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
