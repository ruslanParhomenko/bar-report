import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export default function NavTabs({
  navItems,
  activeTab,
  handleTabChange,
  className,
  disabled,
  withSelect = false,
}: {
  navItems: readonly string[];
  activeTab: string;
  handleTabChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  withSelect?: boolean;
}) {
  if (!navItems.length) return null;

  const tabsWidth = `w-1/${navItems.length}`;
  const length = navItems.length;

  let itemsWidth = "w-4";

  switch (true) {
    case length >= 1 && length <= 2:
      itemsWidth = withSelect ? "w-18" : "w-20";
      break;
    case length >= 3 && length <= 4:
      itemsWidth = withSelect ? "w-12" : "w-16";
      break;

    case length >= 5 && length <= 6:
      itemsWidth = withSelect ? "w-5.5" : "w-9";
      break;

    case length >= 7 && length <= 8:
      itemsWidth = withSelect ? "w-5.5" : "w-6";
      break;

    default:
      itemsWidth = "w-4";
  }

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
                "md:text-md text-bl block truncate text-xs md:min-w-22",
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
