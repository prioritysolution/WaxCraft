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

export type StoneColourSet = {
  /**
   * Sets made in this colour. Null for non-colour rows, and for white on AD
   * stones only (other stone models still show white colour qty).
   */
  colourQty: number | null;
  /** 1-set qty: the size's total for colour rows, the item's own otherwise. */
  perSet: number;
};

/** Model segment of "Stone - Model - Size [- Colour]" (e.g. AD, MQ). */
const isAdStoneModel = (model: string) => /^ad$/i.test(model.trim());

const isWhiteColour = (colour: string) => /white/i.test(colour);

/**
 * Per-colour set breakdown of a design's items. `getPerSet` returns one
 * item's stone qty for a single set; `orderQty` is the design's set count.
 *
 * White colour qty is shown for every stone model except AD.
 */
export const getStoneColourSets = <T>(
  items: T[],
  getName: (item: T) => unknown,
  getPerSet: (item: T) => number,
  orderQty: number,
): ((item: T) => StoneColourSet) => {
  const stoneParts = (name: unknown) =>
    String(name ?? "")
      .split(" - ")
      .map((part) => part.trim())
      .filter(Boolean);
  const isStone = (parts: string[]) =>
    parts.length >= 3 && /stone/i.test(parts[0]);
  const sizeKey = (parts: string[]) =>
    parts.slice(0, 3).join(" - ").toLowerCase();

  // Only colour variants share a size's sets; a plain (no colour) row of the
  // same size is used in every set and is not part of the colour split.
  const sizePerSet = items.reduce<Record<string, number>>((acc, item) => {
    const parts = stoneParts(getName(item));
    if (!isStone(parts) || !parts[3]) return acc;
    const key = sizeKey(parts);
    acc[key] = (acc[key] || 0) + getPerSet(item);
    return acc;
  }, {});

  return (item) => {
    const ownPerSet = getPerSet(item);
    const parts = stoneParts(getName(item));
    const colour = isStone(parts) ? (parts[3] ?? "") : "";
    if (colour === "") return { colourQty: null, perSet: ownPerSet };

    const model = parts[1] ?? "";
    // Hide white colour qty only for AD stones; show it for MQ and others.
    const hideWhiteColourQty =
      isWhiteColour(colour) && isAdStoneModel(model);

    const perSet = sizePerSet[sizeKey(parts)] || 0;
    const colourQty =
      !hideWhiteColourQty && perSet > 0
        ? (ownPerSet * (orderQty > 0 ? orderQty : 1)) / perSet
        : null;
    return { colourQty, perSet };
  };
};
