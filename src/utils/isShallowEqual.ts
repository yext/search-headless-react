/**
 * @param originalObj
 * @param newObj
 * @returns whether the two objects have values with equal references
 */
export default function isShallowEqual(
  originalObj: Record<string, unknown> | unknown[],
  newObj: Record<string, unknown> | unknown[]
): boolean {
  const newKeys = Object.keys(newObj);
  const originalKeys = Object.keys(originalObj);
  if (newKeys.length !== originalKeys.length) {
    return false;
  }
  return newKeys.every(key => {
    const existsInOriginalObj = key in originalObj;
    if (!existsInOriginalObj) {
      return false;
    }
    const originalVal = originalObj[key];
    const newVal = newObj[key];

    if (Array.isArray(originalVal) && Array.isArray(newVal)) {
      if (originalVal.length === 0 && newVal.length === 0) {
        return true;
      }
    }
    return originalVal === newVal;
  });
}