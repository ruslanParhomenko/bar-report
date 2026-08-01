import z from "zod";
import { SECTIONS } from "./constants";

export const itemMenuDailySchema = z.object({
  ro: z.string(),
  en: z.string(),
  ru: z.string(),
  he: z.string(),
  tr: z.string(),
});

export type MenuDailyItem = z.infer<typeof itemMenuDailySchema>;

export const menuDailySchema = z.object(
  Object.fromEntries(
    SECTIONS.map((section) => [section, z.array(itemMenuDailySchema)]),
  ) as Record<
    (typeof SECTIONS)[number],
    z.ZodArray<typeof itemMenuDailySchema>
  >,
);

export type MenuDailyForm = z.infer<typeof menuDailySchema>;

export const menuDailyDefaultValues: MenuDailyForm = Object.fromEntries(
  SECTIONS.map((section) => [
    section,
    [
      { ro: "", en: "", ru: "", he: "", tr: "" },
      { ro: "", en: "", ru: "", he: "", tr: "" },
    ],
  ]),
) as MenuDailyForm;
