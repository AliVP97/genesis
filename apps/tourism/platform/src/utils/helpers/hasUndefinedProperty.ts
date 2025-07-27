function hasUndefinedProperty<T extends Record<string, unknown>>(obj: T) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] === undefined) {
      return true;
    }
  }
  return false;
}
export { hasUndefinedProperty };
