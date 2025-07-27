export const useSessionStorage = () => {
  const getDataFromSessionStorage = (name: string) => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(name) as string;
    } else return 'null';
  };

  const setObject = (name: string, value: Record<string, unknown>) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(name, JSON.stringify({ ...value }));
    }
  };

  const removeItem = (name: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(name);
    }
  };

  const updateObject = (name: string, value: Record<string, unknown>) => {
    if (typeof window !== 'undefined') {
      const prevData: Record<string, unknown> = JSON.parse(getDataFromSessionStorage(name));
      sessionStorage.setItem(name, JSON.stringify({ ...prevData, ...value }));
    }
  };

  const parseObject = (name: string): Record<string, unknown> | undefined => {
    if (typeof window !== 'undefined') {
      return JSON.parse(getDataFromSessionStorage(name));
    }
  };

  const setString = (name: string, value: string) => {
    if (typeof window !== 'undefined') sessionStorage.setItem(name, value);
  };

  const getString = (name: string): string => {
    return getDataFromSessionStorage(name);
  };

  return {
    setObject,
    updateObject,
    parseObject,
    setString,
    getString,
    removeItem,
  };
};
