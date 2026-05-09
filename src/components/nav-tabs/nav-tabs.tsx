import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export default function NavTabs({
  navItems,
  activeTab,
  handleTabChange,
  className,
  disabled,
}: {
  navItems: readonly string[];
  activeTab: string;
  handleTabChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}) {
  if (!navItems.length) return null;

  const tabsWidth = `w-1/${navItems.length}`;
  const itemsWidth = navItems.length < 6 ? "w-16" : "w-7";
  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="bg-background sticky top-0 z-100"
    >
      <TabsList className="order-1 flex h-7 md:order-0 md:gap-4">
        {navItems.map((item, index) => (
          <TabsTrigger
            key={`${item}-${index}`}
            value={item}
            className={cn("hover:text-bl cursor-pointer", tabsWidth, className)}
            disabled={disabled}
          >
            <span
              className={cn(
                "md:text-md text-bl block truncate text-xs md:min-w-20",
                itemsWidth,
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
