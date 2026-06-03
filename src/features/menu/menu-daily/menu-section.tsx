import SelectInput, { OptionSelect } from "@/components/select/select-input";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

export type MenuCategory =
  | "felul principal"
  | "salate si gustari"
  | "deserturi"
  | "garnituri"
  | "felul intii";

type MenuItem = { en: string; ro: string };

function DishSelect({
  fieldName,
  options,
  currentItem,
  onValueChange,
  onRemove,
  allOptions,
}: {
  fieldName: string;
  options: OptionSelect[];
  currentItem?: MenuItem | null;
  onValueChange?: (item: MenuItem | null) => void;
  onRemove?: () => void;
  allOptions: MenuItem[];
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

  const selectedEn = watch(`${basePath}.en`) ?? currentItem?.en ?? "";
  return (
    <div className="mb-4 text-center">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <SelectInput
            fieldName={fieldName}
            options={options}
            value={value ?? currentItem?.ro ?? ""}
            onChange={handleChange}
            placeHolder="— selectează —"
            className="justify-center rounded-[2px] border border-[#c9b99a] bg-[rgba(201,185,154,0.12)] font-['Playfair_Display'] text-[16px] font-semibold text-[#2c1f0e]"
          />
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="h-9 w-9 rounded border border-[#c9b99a] bg-white text-lg font-bold"
        >
          −
        </button>
      </div>

      <p className="mt-1 min-h-4.5 font-['Cormorant_Garamond'] text-[13px] font-light text-[#7a6242] italic">
        {selectedEn}
      </p>
    </div>
  );
}
function DishDisplay({ item }: { item: MenuItem | null | undefined }) {
  if (!item) {
    return (
      <div className="my-6 text-center">
        <span className="font-['Playfair_Display'] text-xl text-[#c9b99a]">
          -
        </span>
      </div>
    );
  }
  return (
    <div className="mb-5 text-center">
      <p
        className="mb-6 text-[20px] leading-tight font-semibold text-[#2c1f0e]"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        {item.ro}
      </p>
      <p
        className="text-[13px] font-light text-[#7a6242] italic"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
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
  category: MenuCategory | null;
  items: MenuItem[] | null;
  allOptions: MenuItem[] | null;
  isEdit: boolean;
  fieldPrefix: string;
}) {
  const { control } = useFormContext();

  const value = useWatch();

  console.log("Watching values in MenuSection:", value); // Debug log

  const { remove } = useFieldArray({
    control,
    name: fieldPrefix,
  });

  const options: OptionSelect[] = (allOptions ?? []).map((d) => ({
    value: d.ro,
    label: d.ro,
  }));

  return (
    <div className="flex h-[40dvh] flex-col justify-between px-1 pb-3">
      <p
        className="my-12 text-center text-[16px] tracking-[0.18em] text-[#9a8060] uppercase"
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
            options={options}
            allOptions={allOptions ?? []}
            currentItem={item}
            onRemove={() => remove(idx)}
          />
        ) : (
          <DishDisplay key={idx} item={item} />
        ),
      )}
    </div>
  );
}
