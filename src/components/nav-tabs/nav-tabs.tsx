import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export default function NavTabs<T extends string>({
  navItems,
  activeTab,
  handleTabChange,
  className,
  disabled,
  withSelect = false,
  tabsHeight = "h-7",
}: {
  navItems: readonly T[];
  activeTab: T;
  handleTabChange: (value: T) => void;
  className?: string;
  disabled?: boolean;
  withSelect?: boolean;
  tabsHeight?: string;
}) {
  if (!navItems.length) return null;

  const tabsWidth = `w-1/${navItems.length}`;
  const length = navItems.length;

  let itemsWidth = "w-4";

  switch (true) {
    case length >= 1 && length <= 2:
      itemsWidth = withSelect ? "w-16" : "w-20";
      break;
    case length >= 3 && length <= 4:
      itemsWidth = withSelect ? "w-12" : "w-16";
      break;

    case length >= 5 && length <= 6:
      itemsWidth = withSelect ? "w-5.5" : "w-9";
      break;

    case length >= 7 && length < 8:
      itemsWidth = withSelect ? "w-5.5" : "w-6";
      break;

    default:
      itemsWidth = "w-3";
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        handleTabChange(value as T);
      }}
    >
      <TabsList className={cn("order-1 flex md:order-0 md:gap-4", tabsHeight)}>
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
