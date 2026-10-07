// Stone item names follow "Stone - Model - Size [- Color]". Rows sharing the
// same "Stone - Model - Size" are placed together (all colours of one size,
// then the next size). Group order follows first appearance and the original
// order is kept inside each group; non-stone rows are left as their own group.
const getStoneGroupKey = (itemName: unknown, index: number): string => {
  const parts = String(itemName ?? "")
    .split(" - ")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length >= 3 && /stone/i.test(parts[0])) {
    return parts.slice(0, 3).join(" - ").toLowerCase();
  }

  return `__item_${index}`;
};

export const groupStoneItemsBySize = <T>(
  items: T[],
  getName: (item: T) => unknown,
): T[] => {
  const groups = new Map<string, T[]>();

  items.forEach((item, index) => {
    const key = getStoneGroupKey(getName(item), index);
    const group = groups.get(key);
    if (group) group.push(item);
    else groups.set(key, [item]);
  });

  return [...groups.values()].flat();
};
