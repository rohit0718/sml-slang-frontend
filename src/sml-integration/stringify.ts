export const stringify = (
  // TODO: update this to SML value type
  value: any,
  indent: number | string = 2,
  splitlineThreshold = 80
): string => {
  return value.toString()
};
