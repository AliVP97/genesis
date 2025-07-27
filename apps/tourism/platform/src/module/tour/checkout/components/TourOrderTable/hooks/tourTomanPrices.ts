export const tourPrices = (price: string | undefined) => {
  if (!price) {
    return '';
  }

  return String(price)?.replace(/,/g, '');
};
