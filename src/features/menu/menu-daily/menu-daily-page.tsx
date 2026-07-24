"use client";

import { createMenuDaily } from "@/app/actions/menu-daily/menu-daily-action";

import FormWrapper from "@/components/wrapper/form-wrapper";
import { useEdit } from "@/providers/edit-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { OrnamentBorder } from "@/components/wrapper/ornament-border";
import { SECTION_1, SECTION_2, SECTION_3, SECTIONS } from "./constants";
import MenuSection from "./menu-section";
import { MenuDailyForm, menuDailySchema } from "./schema";

export default function MenuDailyPage({
  data,
  menuDaily,
  qrUrl,
}: {
  data: MenuDailyForm | null;
  menuDaily?: MenuDailyForm | null;
  qrUrl?: string;
}) {
  const { isEdit, setIsEdit } = useEdit();

  const getDefaultValues = (menuDaily?: MenuDailyForm | null): MenuDailyForm =>
    Object.fromEntries(
      SECTIONS.map((section) => {
        const count = section === "salate si gustari" ? 3 : 2;
        return [
          section,
          Array.from(
            { length: count },
            (_, index) => menuDaily?.[section]?.[index] ?? { ro: "", en: "" },
          ),
        ];
      }),
    ) as MenuDailyForm;

  const form = useForm<MenuDailyForm>({
    resolver: zodResolver(menuDailySchema),
    defaultValues: getDefaultValues(menuDaily),
  });

  useEffect(() => {
    form.reset(getDefaultValues(menuDaily));
  }, [menuDaily]);

  const value = form.watch();

  const onSubmit: SubmitHandler<MenuDailyForm> = async (formData) => {
    await createMenuDaily(formData);
    setIsEdit(false);
  };

  const getItems = (cat: (typeof SECTIONS)[number]) => value?.[cat] ?? [];

  const getAllOptions = (cat: (typeof SECTIONS)[number]) => data?.[cat] ?? [];

  return (
    <div
      className="relative h-[90dvh] p-2"
      style={{ fontFamily: "'Cormorant Garamond', serif" }}
    >
      <FormWrapper form={form} onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-6">
          <div>
            <OrnamentBorder className="md:h-14! md:w-14!">
              {SECTION_1.map((cat) => (
                <div key={cat} className="md:p-2">
                  <MenuSection
                    category={cat}
                    items={getItems(cat)}
                    allOptions={getAllOptions(cat)}
                    isEdit={isEdit}
                    fieldPrefix={cat}
                    qrUrl={qrUrl}
                  />
                </div>
              ))}
            </OrnamentBorder>
          </div>
          <div>
            <OrnamentBorder className="md:h-14! md:w-14!">
              {SECTION_2.map((cat) => (
                <div key={cat} className="md:p-2">
                  <MenuSection
                    category={cat}
                    items={getItems(cat)}
                    allOptions={getAllOptions(cat)}
                    isEdit={isEdit}
                    fieldPrefix={cat}
                    qrUrl={qrUrl}
                  />
                </div>
              ))}
            </OrnamentBorder>
          </div>
          <div>
            <OrnamentBorder className="md:h-14! md:w-14!">
              {SECTION_3.map((cat) => (
                <div key={cat} className="md:p-2">
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
      </FormWrapper>
    </div>
  );
}
