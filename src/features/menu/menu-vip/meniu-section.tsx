import { Row } from "./menu-row";
import { LocalTranslateFn, MenuSection } from "./types";

export function Section({
  section,
  t,
}: {
  section: MenuSection;
  t: LocalTranslateFn;
}) {
  return (
    <div className="print:my-3">
      <h3 className="m-0 text-center text-xs font-bold tracking-widest text-[#1a1a1a] italic md:text-base print:mt-2">
        · {t(section.title)} ·
      </h3>

      {section.items?.map((item, i) => (
        <Row key={i} item={item} t={t} />
      ))}

      {section.subgroups?.map((sg, i) => (
        <div key={i} className="print:mt-1">
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
