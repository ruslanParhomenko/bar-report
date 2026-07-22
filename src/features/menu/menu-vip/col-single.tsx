import { Section } from "./meniu-section";
import { LocalTranslateFn, MenuColumn } from "./types";

export function ColSingle({
  col,
  t,
}: {
  col: MenuColumn;
  t: LocalTranslateFn;
}) {
  return (
    <div className="pb-3 md:h-full md:px-1">
      <h2
        className="text-center font-bold tracking-widest text-[#1a1a1a] uppercase"
        style={{ fontSize: "1rem" }}
      >
        {col.title ? t(col.title) : ""}
      </h2>

      {col.sections?.map((sec) => (
        <Section key={sec.id} section={sec} t={t} />
      ))}
    </div>
  );
}
