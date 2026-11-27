export const UNITE_TYPE = ["kg", "l", "pcs"] as const;
export const CATEGORY_TYPE = [
  "vegetables_fruits",
  "meat",
  "poultry",
  "fish_seafood",
  "dairy",
  "eggs",
  "grocery",
  "fats_oils",
  "spices",
  "sauces_canned",
  "frozen",
  "bakery",
  "confectionery",
] as const;

export type ProductType = {
  id: string;
  name: string;

  coefficient: string;
  unit: (typeof UNITE_TYPE)[number];
  category: (typeof CATEGORY_TYPE)[number];
};
