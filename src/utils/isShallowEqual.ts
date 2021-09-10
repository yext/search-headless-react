/**
 * @param originalObj
 * @param newObj
 * @returns whether the two objects have values with equal references
 */
export default function isShallowEqual(
  originalObj: Record<string, unknown>,
  newObj: Record<string, unknown>
): boolean {
  const newKeys = Object.keys(newObj);
  if (newKeys.length !== Object.keys(newKeys).length) {
    return false;
  }
  return newKeys.every(key => {
    const isNewProp = !(key in originalObj);
    const isUpdatedProp = originalObj[key] !== newObj[key];
    return !isNewProp && !isUpdatedProp;
  });
}