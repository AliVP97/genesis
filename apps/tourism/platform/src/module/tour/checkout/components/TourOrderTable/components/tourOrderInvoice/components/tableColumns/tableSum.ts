import { tourPrices } from '../../../../hooks/tourTomanPrices';
import { persianToEnglishNumberWithCommas } from './persianToEnglishNumberWithCommas';

export const tableSum = (price: string | undefined, count: number) => {
  if (!price) {
    return '0';
  }

  const multiply =
    (count || 0) * Number(tourPrices(persianToEnglishNumberWithCommas(price as string)));

  return String(multiply);
};
