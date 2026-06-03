import SelectInput, { OptionSelect } from "@/components/select/select-input";
import { useFormContext } from "react-hook-form";
import { SECTIONS } from "./constants";
import { MenuDailyItem } from "./schema";

function DishSelect({
  fieldName,
  options,
  currentItem,
  onValueChange,
  allOptions,
}: {
  fieldName: string;
  options: OptionSelect[];
  currentItem?: MenuDailyItem | null;
  onValueChange?: (item: MenuDailyItem | null) => void;
  allOptions: MenuDailyItem[];
}) {
  const { setValue, watch } = useFormContext();

  const value = watch(fieldName) as string | undefined;

  const basePath = fieldName.replace(/\.ro$/, "");

  const handleChange = (val: string) => {
    const found = allOptions.find((o) => o.ro === val);

    setValue(`${basePath}.ro`, val);
    setValue(`${basePath}.en`, found?.en ?? "");

    if (onValueChange) {
      onValueChange(
        found
          ? {
              ro: found.ro,
              en: found.en,
            }
          : null,
      );
    }
  };

  return (
    <div className="mb-4 text-center">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <SelectInput
            fieldName={fieldName}
            options={options}
            value={value ?? currentItem?.ro ?? ""}
            onChange={handleChange}
            className="bg-gr! justify-center rounded-[2px] border border-[#c9b99a] font-['Playfair_Display'] text-[16px] font-semibold text-[#2c1f0e]"
          />
        </div>
      </div>
    </div>
  );
}
function DishDisplay({ item }: { item: MenuDailyItem }) {
  if (!item) {
    return null;
  }
  return (
    <div className="mb-5 text-center">
      <p className="mb-6 font-['Cormorant_Garamond'] text-[20px] leading-tight font-semibold text-[#2c1f0e]">
        {item.ro}
      </p>
      <p className="mt-1 min-h-4.5 font-['Cormorant_Garamond'] text-[13px] font-light text-[#7a6242] italic">
        {item.en}
      </p>
    </div>
  );
}
export default function MenuSection({
  category,
  items,
  allOptions,
  isEdit,
  fieldPrefix,
}: {
  category: (typeof SECTIONS)[number] | null;
  items: MenuDailyItem[] | null;
  allOptions: MenuDailyItem[] | null;
  isEdit: boolean;
  fieldPrefix: string;
}) {
  const options: OptionSelect[] = (allOptions ?? []).map((d) => ({
    value: d.ro,
    label: d.ro,
  }));

  return (
    <div className="flex h-[40dvh] flex-col justify-between px-1 pb-3">
      <p
        className="my-12 text-center text-[12px] tracking-[0.18em] text-[#9a8060] uppercase"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        — {category ? category : "Section"} —
      </p>

      <div className="mx-auto mb-5 h-px w-10 bg-[#c9b99a]" />

      {items?.map((item, idx) =>
        isEdit ? (
          <DishSelect
            key={idx}
            fieldName={`${fieldPrefix}.${idx}.ro`}
            options={[{ value: "-", label: " —" }, ...options]}
            allOptions={allOptions ?? []}
            currentItem={item}
          />
        ) : (
          <DishDisplay key={idx} item={item} />
        ),
      )}
    </div>
  );
}
