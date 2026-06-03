import z from "zod";
import { SECTIONS } from "./constants";

export const itemMenuDailySchema = z.object({
  ro: z.string(),
  en: z.string(),
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
      { ro: "", en: "" },
      { ro: "", en: "" },
    ],
  ]),
) as MenuDailyForm;
