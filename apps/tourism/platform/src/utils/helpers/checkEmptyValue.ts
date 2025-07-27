function isObjectNotEmpty(value?: Record<string, unknown>): boolean {
  return typeof value === 'object' && value !== null && Object.keys(value).length > 0;
}

export { isObjectNotEmpty };
