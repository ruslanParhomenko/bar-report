import { LocalTranslateFn, MenuSection } from "../model/types";
import { Row } from "./menu-row";

export function Section({
  section,
  t,
}: {
  section: MenuSection;
  t: LocalTranslateFn;
}) {
  return (
    <div className="my-2 print:my-3">
      <h3 className="m-0 mt-2 text-center text-xs font-bold tracking-widest text-[#1a1a1a] italic md:text-base">
        · {t(section.title)} ·
      </h3>

      {section.items?.map((item, i) => (
        <Row key={i} item={item} t={t} />
      ))}

      {section.subgroups?.map((sg, i) => (
        <div key={i} className="mt-1">
          <p
            className="mb-px text-center text-xs font-bold tracking-wider text-[#1a1a1a] uppercase md:text-base"
            style={{ fontSize: "0.55rem" }}
          >
            {sg.label}
          </p>

          {sg.items.map((item, j) => (
            <Row key={j} item={item} t={t} />
          ))}
        </div>
      ))}
    </div>
  );
}
