import { format } from "date-fns";

//select by name|field
export function getSelectByName<T extends Record<string, any>>(
  data: T[],
  tag: keyof T
) {
  const names = new Set<string>();

  data.forEach((report) => {
    const group = report?.[tag];
    if (Array.isArray(group)) {
      group.forEach((item: any) => {
        if (item?.name) names.add(item.name);
      });
    }
  });

  return [
    { label: "all", value: "all" },
    ...Array.from(names).map((name) => ({
      label: name,
      value: name,
    })),
  ];
}

// select by date
export type SelectOption = {
  label: string;
  value: string;
};

type ItemWithDateAndId = {
  id: number | string;
  date: string | Date;
};

export function formatSelectData<T extends ItemWithDateAndId>(
  data?: T[]
): SelectOption[] {
  if (!data || data.length === 0) {
    return [{ label: "all", value: "all" }];
  }

  const formatted = data.map((item) => ({
    label: item.id.toString(),
    value: format(new Date(item.date), "dd.MM.yy"),
  }));

  return [{ label: "all", value: "all" }, ...formatted];
}

//scroll to top
export const handleScrollTop = ({ accordionRef }: { accordionRef: any }) => {
  setTimeout(() => {
    if (accordionRef.current) {
      const y =
        accordionRef.current.getBoundingClientRect().top + window.scrollY - 5;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, 350);
};
