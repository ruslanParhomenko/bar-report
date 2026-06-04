"use client";

import { createMenuDaily } from "@/app/actions/menu-daily/menu-daily-action";

import FormWrapper from "@/components/wrapper/form-wrapper";
import { useEdit } from "@/providers/edit-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { OrnamentBorder } from "@/components/wrapper/ornament-border";
import { SECTION_1, SECTION_2, SECTION_3, SECTIONS } from "./constants";
import MenuSection from "./menu-section";
import { MenuDailyForm, menuDailySchema } from "./schema";

export default function MenuDailyPage({
  data,
  menuDaily,
}: {
  data: MenuDailyForm | null;
  menuDaily?: MenuDailyForm | null;
}) {
  const { isEdit, setIsEdit } = useEdit();

  const defaultValues: MenuDailyForm = Object.fromEntries(
    SECTIONS.map((section) => [
      section,
      [...Array(2)].map(
        (_, index) =>
          menuDaily?.[section]?.[index] ?? {
            ro: "",
            en: "",
          },
      ),
    ]),
  ) as MenuDailyForm;

  const form = useForm<MenuDailyForm>({
    resolver: zodResolver(menuDailySchema),
    defaultValues: defaultValues,
  });

  const value = form.watch();

  const onSubmit: SubmitHandler<MenuDailyForm> = async (formData) => {
    await createMenuDaily(formData);
    setIsEdit(false);
  };

  const getItems = (cat: (typeof SECTIONS)[number]) => value?.[cat] ?? [];

  const getAllOptions = (cat: (typeof SECTIONS)[number]) => data?.[cat] ?? [];

  return (
    <div
      className="relative h-[92dvh] p-6"
      style={{ fontFamily: "'Cormorant Garamond', serif" }}
    >
      <FormWrapper form={form} onSubmit={onSubmit}>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <OrnamentBorder className="h-14! w-14!">
              {SECTION_1.map((cat) => (
                <div key={cat} className="p-2">
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
            <OrnamentBorder className="h-14! w-14!">
              {SECTION_2.map((cat) => (
                <div key={cat} className="p-2">
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
            <OrnamentBorder className="h-14! w-14!">
              {SECTION_3.map((cat) => (
                <div key={cat} className="p-2">
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
