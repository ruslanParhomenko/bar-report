export type RecipeItem = {
  name: string;
  quantity: string;
  coefficient: string;
  unit: string;
  nameId: string;
};

export type CalculationCardType = {
  id: string;
  name: string;
  unit: string;
  category: string;
  weight: string;
  expirationPeriod: string;
  description: string;
  portion: string;
  recipe: RecipeItem[];
};
