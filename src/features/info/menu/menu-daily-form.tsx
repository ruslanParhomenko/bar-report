"use client";

import { MenuDailyDictionary } from "@/app/actions/data-constants/data-menu-daily-action";
import SelectInput, { OptionSelect } from "@/components/select/select-input";

import FormWrapper from "@/components/wrapper/form-wrapper";
import { useEdit } from "@/providers/edit-provider";
import Image from "next/image";
import { SubmitHandler, useForm, useFormContext } from "react-hook-form";

// pattern.svg is placed in /public/pattern.svg
// It is a bottom-left corner ornament by default.
// Each corner is achieved by CSS transform (scaleX / scaleY / both).

// ─── Types ───────────────────────────────────────────────────────────────────

type MenuCategory =
  | "felul principal"
  | "salate si gustari"
  | "deserturi"
  | "garnituri"
  | "felul intii";

type MenuItem = { en: string; ro: string };

type MenuDailyData = {
  [key in MenuCategory]?: MenuItem[];
};

// ─── Constants ───────────────────────────────────────────────────────────────

const SECTION_LABELS: Record<MenuCategory, string> = {
  "felul principal": "Felul Principal",
  "salate si gustari": "Salate și Gustări",
  deserturi: "Deserturi",
  garnituri: "Garnituri",
  "felul intii": "Felul Întîi",
};

const TOP_SECTIONS: MenuCategory[] = [
  "felul principal",
  "salate si gustari",
  "deserturi",
];
const BOT_SECTIONS: (MenuCategory | null)[] = [
  "garnituri",
  "felul intii",
  null,
];

// ─── Corner Ornament ─────────────────────────────────────────────────────────
// pattern.svg is a bottom-left ornament.
// Mirrors:  tl → scaleY(-1)   tr → scale(-1,-1)   br → scaleX(-1)   bl → as-is

const CORNER_TRANSFORMS: Record<string, string> = {
  bl: "scale(1, 1)",
  tl: "scale(1, -1)",
  br: "scale(-1, 1)",
  tr: "scale(-1, -1)",
};

const CORNER_ORIGIN: Record<string, string> = {
  bl: "bottom left",
  tl: "top left",
  br: "bottom right",
  tr: "top right",
};

function CornerOrnament({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  return (
    <div
      className="pointer-events-none absolute h-28 w-28 overflow-hidden"
      style={{
        top: position.startsWith("t") ? 0 : "auto",
        bottom: position.startsWith("b") ? 0 : "auto",
        left: position.endsWith("l") ? 0 : "auto",
        right: position.endsWith("r") ? 0 : "auto",
      }}
    >
      <Image
        src="/pattern.svg"
        alt=""
        width={112}
        height={112}
        className="h-full w-full object-contain opacity-70"
        style={{
          transform: CORNER_TRANSFORMS[position],
          transformOrigin: CORNER_ORIGIN[position],
        }}
      />
    </div>
  );
}

// ─── Dish Display (view mode) ─────────────────────────────────────────────────

function DishDisplay({ item }: { item: MenuItem | null | undefined }) {
  if (!item) {
    return (
      <div className="my-3 text-center">
        <span className="font-['Playfair_Display'] text-xl text-[#c9b99a]">
          -
        </span>
      </div>
    );
  }
  return (
    <div className="mb-5 text-center">
      <p className="mb-1 font-['Playfair_Display'] text-[20px] leading-tight font-semibold text-[#2c1f0e]">
        {item.ro}
      </p>
      <p className="font-['Cormorant_Garamond'] text-[13px] font-light text-[#7a6242] italic">
        {item.en}
      </p>
    </div>
  );
}

// ─── Dish Select (edit mode) ──────────────────────────────────────────────────

function DishSelect({
  fieldName,
  options,
  currentItem,
  onValueChange,
}: {
  fieldName: string;
  options: OptionSelect[];
  currentItem?: MenuItem | null;
  onValueChange?: (item: MenuItem | null) => void;
}) {
  const { control, setValue, watch } = useFormContext();
  const value = watch(fieldName) as string | undefined;

  const handleChange = (val: string) => {
    setValue(fieldName, val);
    if (onValueChange) {
      const found = options.find((o) => o.value === val);
      onValueChange(found ? { ro: found.value, en: found.label } : null);
    }
  };

  // derive english from selected value
  const selectedEn =
    options.find((o) => o.value === (value ?? currentItem?.ro))?.label ??
    currentItem?.en ??
    "";

  return (
    <div className="mb-4 text-center">
      <SelectInput
        fieldName={fieldName}
        options={options}
        placeHolder="— selectează —"
        value={value ?? currentItem?.ro ?? ""}
        onChange={handleChange}
        className="rounded-[2px] border border-[#c9b99a] bg-[rgba(201,185,154,0.12)] text-center font-['Playfair_Display'] text-[16px] font-semibold text-[#2c1f0e]"
      />
      <p className="mt-1 min-h-[18px] font-['Cormorant_Garamond'] text-[13px] font-light text-[#7a6242] italic">
        {selectedEn}
      </p>
    </div>
  );
}

// ─── Section Column ───────────────────────────────────────────────────────────

function MenuSection({
  category,
  items,
  allOptions,
  isEdit,
  fieldPrefix,
}: {
  category: MenuCategory;
  items: MenuItem[];
  allOptions: MenuItem[];
  isEdit: boolean;
  fieldPrefix: string;
}) {
  const options: OptionSelect[] = allOptions.map((d) => ({
    value: d.ro,
    label: d.en,
  }));

  return (
    <div>
      {/* Section label */}
      <p
        className="mb-3 text-center text-[11px] tracking-[0.18em] text-[#9a8060] uppercase"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        — {SECTION_LABELS[category]} —
      </p>

      {/* Decorative line */}
      <div className="mx-auto mb-5 h-px w-10 bg-[#c9b99a]" />

      {/* Dishes */}
      {items.map((item, idx) =>
        isEdit ? (
          <DishSelect
            key={idx}
            fieldName={`${fieldPrefix}.${idx}.ro`}
            options={options}
            currentItem={item}
          />
        ) : (
          <DishDisplay key={idx} item={item} />
        ),
      )}

      {/* Empty slot in edit mode for adding */}
      {isEdit && (
        <DishSelect
          key="new"
          fieldName={`${fieldPrefix}.${items.length}.ro`}
          options={options}
          currentItem={null}
        />
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MenuDailyForm({
  data,
  menuDaily,
}: {
  data: MenuDailyDictionary | null;
  menuDaily?: MenuDailyDictionary | null;
}) {
  const { isEdit, setIsEdit } = useEdit();

  const form = useForm<MenuDailyDictionary>({
    defaultValues: menuDaily || {},
  });

  const onSubmit: SubmitHandler<MenuDailyDictionary> = async (formData) => {
    console.log(formData);
    setIsEdit(false);
  };

  // Safely extract arrays
  const menuData = (menuDaily as MenuDailyData) ?? {};
  const allData = (data as MenuDailyData) ?? {};

  const getItems = (cat: MenuCategory): MenuItem[] =>
    (menuData[cat] as MenuItem[]) ?? [];

  const getAllOptions = (cat: MenuCategory): MenuItem[] =>
    (allData[cat] as MenuItem[]) ?? [];

  return (
    <div
      className="relative min-h-screen bg-[#faf8f4] px-10 py-14"
      style={{ fontFamily: "'Cormorant Garamond', serif" }}
    >
      {/* Corner ornaments */}
      <CornerOrnament position="tl" />
      <CornerOrnament position="tr" />
      <CornerOrnament position="bl" />
      <CornerOrnament position="br" />

      <FormWrapper form={form} onSubmit={onSubmit}>
        {/* Edit / Save button */}
        <div className="relative z-10 mb-6 flex justify-end">
          {isEdit ? (
            <button
              type="submit"
              className="rounded-[2px] border border-[#6b4f2a] bg-[#6b4f2a] px-6 py-2 font-['Cormorant_Garamond'] text-sm tracking-widest text-[#faf8f4] transition-colors hover:bg-[#4d3720]"
            >
              Salvează
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEdit(true)}
              className="rounded-[2px] border border-[#9a8060] bg-transparent px-6 py-2 font-['Cormorant_Garamond'] text-sm tracking-widest text-[#6b4f2a] transition-colors hover:bg-[#6b4f2a] hover:text-[#faf8f4]"
            >
              Editează
            </button>
          )}
        </div>

        {/* ── Top row: 3 columns ── */}
        <div className="grid grid-cols-3 divide-x divide-[#c9b99a]">
          {TOP_SECTIONS.map((cat) => (
            <div key={cat} className="px-6 py-2">
              <MenuSection
                category={cat}
                items={getItems(cat)}
                allOptions={getAllOptions(cat)}
                isEdit={isEdit}
                fieldPrefix={cat}
              />
            </div>
          ))}
        </div>

        {/* Horizontal divider */}
        <div className="my-8 border-t border-[#c9b99a]" />

        {/* ── Bottom row: 3 columns ── */}
        <div className="grid grid-cols-3 divide-x divide-[#c9b99a]">
          {BOT_SECTIONS.map((cat, i) =>
            cat ? (
              <div key={cat} className="px-6 py-2">
                <MenuSection
                  category={cat}
                  items={getItems(cat)}
                  allOptions={getAllOptions(cat)}
                  isEdit={isEdit}
                  fieldPrefix={cat}
                />
              </div>
            ) : (
              <div key={`empty-${i}`} />
            ),
          )}
        </div>
      </FormWrapper>
    </div>
  );
}
