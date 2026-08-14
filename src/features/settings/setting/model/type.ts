export type DataProducts = {
  ingredients: string[];
  salad: string[];
  soup: string[];
  meat: string[];
  garnish: string[];
  dessert: string[];
  meat_fish: string[];
  semifinished: string[];
  staff_first: string[];
  staff_garnish: string[];
  staff_main: string[];
  staff_snacks: string[];
};

export type DataOrderProducts = {
  bar: Record<string, string[]>;
  cucina: Record<string, string[]>;
  ttnBar: Record<string, string[]>;
  ttnCucina: Record<string, string[]>;
  techTTN: Record<string, string[]>;
};

export type DataTTN = {
  agent: string[];
  agentNbm: string[];
};

export type DataPriceList = {
  currency: number;
  priceList: Record<
    string,
    {
      name: string;
      "price-chips": number;
      cost: number;
      "price-chips-new": number;
      sales: number;
    }[]
  >;
};

export type MenuItem = {
  name: string;
  weight: string;
  price: number | null;
  label?: string;
  qrUrl?: string;
};

export type DataMenu = Record<string, MenuItem[]>;
