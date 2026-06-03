export function getUniqueProductNames(data: any[]) {
  const namesSet = new Set();

  for (const day of data) {
    if (Array.isArray(day.product)) {
      for (const item of day.product) {
        if (item.name || item.value) {
          namesSet.add(item.name);
        }
      }
    }
  }

  return Array.from(namesSet);
}
