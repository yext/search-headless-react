/**
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
    return existsInOriginalObj && originalObj[key] === newObj[key];
  });
}