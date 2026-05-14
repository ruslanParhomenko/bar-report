import { TABS_BY_ROUTE } from "@/components/home-layout/header-bar/constants";
import { ALGORITHM_MAIN_ROUTE } from "@/constants/route-tag";
import z from "zod";

export const FIELD_CONFIG = TABS_BY_ROUTE[ALGORITHM_MAIN_ROUTE];

export const valueSchema = z.object({
  value: z.string(),
});

export const defaultValues: z.infer<typeof valueSchema> = {
  value: "",
};

export const algorithmSchema = z.object({
  ...Object.fromEntries(
    FIELD_CONFIG.map((name) => [name, z.array(valueSchema)]),
  ),
});

export type AlgorithmData = z.infer<typeof algorithmSchema>;

export const defaultAlgorithm: AlgorithmData = {
  ...Object.fromEntries(FIELD_CONFIG.map((name) => [name, [defaultValues]])),
};
