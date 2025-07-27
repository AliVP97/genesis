export const setSessionStorage = (name: string, value: string | unknown) => {
  if (typeof window !== 'undefined') {
    if (typeof value === 'string') sessionStorage.setItem(name, value);
    if (typeof value !== 'string') sessionStorage.setItem(name, JSON.stringify(value));
  }
};

export const getSessionStorage = (name: string) => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem(name) as string;
  } else return 'null';
};
