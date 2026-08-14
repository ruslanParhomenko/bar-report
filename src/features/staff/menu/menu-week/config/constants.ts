export const SECTIONS = [
  "felul intii",
  "felul principal",
  "garnituri",
  "salate si gustari",
] as const;

export const SECTION_LABELS: Record<(typeof SECTIONS)[number], string> = {
  "felul intii": "Первое",
  "felul principal": "Второе",
  garnituri: "Гарнир",
  "salate si gustari": "Салаты и закуски",
};

export const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export const DAY_LABELS: Record<(typeof DAYS)[number], string> = {
  monday: "Понедельник",
  tuesday: "Вторник",
  wednesday: "Среда",
  thursday: "Четверг",
  friday: "Пятница",
  saturday: "Суббота",
  sunday: "Воскресенье",
};
