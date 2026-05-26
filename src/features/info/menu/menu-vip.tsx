import {
  MenuDataType,
  MenuItem,
} from "@/app/actions/data-constants/data-menu-action";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";

function SectionBlock({
  title,
  items,
  t,
}: {
  title: string;
  items: MenuItem[];
  t: ReturnType<typeof useTranslations>;
}) {
  if (!items.length) return null;

  return (
    <div>
      <h2 className="flex items-center justify-center py-1 text-sm font-bold tracking-wide uppercase">
        {title}
      </h2>

      <div className="flex gap-4 text-xs">
        <ul className="w-1/2 list-none space-y-0.5">
          {items.map((item, id) => (
            <li key={id} className="leading-tight">
              {t(item.name)}
            </li>
          ))}
        </ul>

        <ul className="text-muted-foreground flex-1 list-none space-y-0.5 text-center">
          {items.map((item, id) => (
            <li key={id} className="leading-tight">
              {item.weight}
            </li>
          ))}
        </ul>

        <ul className="w-1/4 list-none space-y-0.5 text-right">
          {items.map((item, id) => (
            <li key={id} className="leading-tight">
              {item.price}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function MenuVip({ data }: { data: MenuDataType | null }) {
  const t = useTranslations("Menu");

  if (!data?.pages) return null;

  const columns = data.pages
    .flatMap((page) => page.columns)
    .filter((col) => col.type !== "cover");

  return (
    <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-3">
      {columns.map((column, colIndex) => (
        <Card key={colIndex} className="bg-transparent px-4 py-2">
          {(column.sections ?? []).map((section, secIndex) => {
            if (section.subgroups?.length) {
              return (
                <div key={secIndex}>
                  <h2 className="flex items-center justify-center py-0.5 text-sm font-bold tracking-wide uppercase">
                    {t(section.title)}
                  </h2>
                  {section.subgroups.map((sub, subIndex) => (
                    <div key={subIndex}>
                      <p className="text-muted-foreground text-center text-xs font-semibold">
                        {sub.label}
                      </p>
                      <SectionBlock title="" items={sub.items} t={t} />
                    </div>
                  ))}
                </div>
              );
            }

            return (
              <SectionBlock
                key={secIndex}
                title={section.title}
                items={section.items ?? []}
                t={t}
              />
            );
          })}
        </Card>
      ))}
    </div>
  );
}
