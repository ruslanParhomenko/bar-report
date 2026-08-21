import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export default function NavTabs<T extends string>({
  navItems,
  activeTab,
  handleTabChange,
  classTrigger,
  disabled,
  classTabs,
}: {
  navItems: readonly T[];
  activeTab: T;
  handleTabChange: (value: T) => void;
  classTrigger?: string;
  disabled?: boolean;
  withSelect?: boolean;
  classTabs?: string;
}) {
  if (!navItems.length) return null;

  const tabsWidth = navItems.length < 6 ? `w-1/${navItems.length}` : "w-10";

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        handleTabChange(value as T);
      }}
    >
      <TabsList
        className={cn("order-1 flex h-7 md:order-0 md:gap-4", classTabs)}
      >
        {navItems.map((item, index) => (
          <TabsTrigger
            key={`${item}-${index}`}
            value={item}
            className={cn("cursor-pointer md:w-28", tabsWidth, classTrigger)}
            disabled={disabled}
          >
            <span
              className={cn(
                "md:text-md text-bl/80 hover:text-rd truncate text-xs",
                item === activeTab ? "text-rd" : "",
              )}
            >
              {item}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
