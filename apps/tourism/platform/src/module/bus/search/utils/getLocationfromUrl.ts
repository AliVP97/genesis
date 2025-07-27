export const getLocationfromUrl = (url: string) => {
  const [origin, destination] = url.split('/');
  return { origin, destination };
};
