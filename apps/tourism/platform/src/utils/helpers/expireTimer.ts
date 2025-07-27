export const TimeComparator = (key: string, service: string) => {
  const expireTime = parseInt(JSON.parse(localStorage.getItem(key) as string));
  const currentTime = new Date().getTime();

  if (service.includes('international')) {
    return expireTime * 1000 - currentTime;
  }

  if (service.includes('flights') || service.includes('hotel')) {
    const adjustedExpireTime = key === 'reserve_expiry' ? expireTime * 1000 : expireTime;
    return adjustedExpireTime - currentTime;
  }

  if (service.includes('train')) {
    return expireTime * 1000 - currentTime;
  }

  return expireTime * 1000;
};
