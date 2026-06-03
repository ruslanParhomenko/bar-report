"use client";

import {
  MenuDailyDictionary,
  MenuDailyItem,
} from "@/app/actions/data-constants/data-menu-daily-action";
import {
  createMenuDaily,
  MenuDailyForm,
} from "@/app/actions/menu-daily/menu-daily-action";

import FormWrapper from "@/components/wrapper/form-wrapper";
import { useEdit } from "@/providers/edit-provider";
import { SubmitHandler, useForm } from "react-hook-form";
import { OrnamentBorder } from "../../info/menu-to-print/menu-to-print";
import { SECTION_1, SECTION_2, SECTION_3 } from "./constants";
import MenuSection from "./menu-section";

export default function MenuDailyPage({
  data,
  menuDaily,
}: {
  data: MenuDailyDictionary | null;
  menuDaily?: MenuDailyForm | null;
}) {
  const { isEdit, setIsEdit } = useEdit();

  const form = useForm<MenuDailyDictionary>({
    defaultValues: {
      ...[
        { ro: "", en: "" },
        { ro: "", en: "" },
      ],
      ...(menuDaily ?? {}),
    },
  });

  const onSubmit: SubmitHandler<MenuDailyDictionary> = async (formData) => {
    console.log("Form data to submit:", formData); // Debug log
    await createMenuDaily(formData);
    setIsEdit(false);
  };

  const getItems = (cat: keyof MenuDailyDictionary) => menuDaily?.[cat] ?? [];

  const getAllOptions = (cat: keyof MenuDailyDictionary) =>
    (data?.[cat] as MenuDailyItem[]) ?? [];

  return (
    <div
      className="relative h-[92dvh] p-6"
      style={{ fontFamily: "'Cormorant Garamond', serif" }}
    >
      <FormWrapper form={form} onSubmit={onSubmit}>
        <>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <OrnamentBorder>
                {SECTION_1.map((cat) => (
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
              </OrnamentBorder>
            </div>
            <div>
              <OrnamentBorder>
                {SECTION_2.map((cat) => (
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
              </OrnamentBorder>
            </div>
            <div>
              <OrnamentBorder>
                {SECTION_3.map((cat) => (
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
              </OrnamentBorder>
            </div>
          </div>
        </>
      </FormWrapper>
    </div>
  );
}
