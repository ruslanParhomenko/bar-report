export const LABELS = [
  "Безалкогольная продукция",
  "Завтраки и десерты",
  "Салаты и закуски",
  "Вторые блюда",
  "Снеки ",
];

export const columns = [
  { key: "platinum", title: "Platinum" },
  { key: "gold", title: "Gold" },
  { key: "silver", title: "Silver" },
  { key: "loyal", title: "Loyal" },
] as const;

export const menu = {
  department: "Рецепция и Пит FM",
  menu: [
    {
      product: "Яичница-глазунья",
      description: [],
    },
    {
      product: "Скроб",
      description: [],
    },
    {
      product: "Каша овсяная",
      description: ["на воде", "на молоке"],
    },
    {
      product: "Добавки / нарезка (подача - отдельно)",
      description: [
        "бекон 1/30",
        "ветчина 1/30",
        "сыр 1/30",
        "масло сливочное 1/20",
        "тост",
      ],
    },
    {
      product: "Фрукты / десерты / снеки",
      description: [
        "фрукты сезонные (без нарезки!)",
        "шоколад / порция",
        "мед 1/20",
        "варенье 1/30",
        "мороженное 1/100",
      ],
    },
    {
      product: "Горячие / холодные напитки",
      description: [
        "чай пакетированный",
        "эспрессо / капучино",
        "американо + молоко / сливки",
        "вода / сок / газированные напитки",
      ],
    },
  ],
};
