const calculateTotal = <T extends Record<string, string | number>>(
  dataArray: T[],
  key: keyof T
): number => {
  return parseFloat(
    dataArray
      .reduce(
        (sum, item) =>
          sum +
          (typeof item[key] === "number"
            ? (item[key] as number)
            : parseFloat(item[key] as string) || 0),
        0
      )
      .toFixed(2)
  );
};

export default calculateTotal;
