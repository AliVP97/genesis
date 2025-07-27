import { TTourGetCheckoutResponse } from 'services/tour/v2/checkout/type';
import { tourPrices } from '../../../../hooks/tourTomanPrices';
import { persianToEnglishNumberWithCommas } from './persianToEnglishNumberWithCommas';

export const adultSum = (counter: string, data: TTourGetCheckoutResponse) => {
  const adultCounter = counter === '3' || counter === '5' ? Number(counter) - 1 : counter;
  const isOneDay = data?.isOneDay;
  const adultCountValue = Number(adultCounter) || 0;
  const adultPrice =
    !isOneDay && adultCountValue === 1
      ? Number(tourPrices(persianToEnglishNumberWithCommas(data?.adultPriceSingle as string)))
      : Number(tourPrices(persianToEnglishNumberWithCommas(data?.adultPriceDouble as string)));
  return (adultCountValue * adultPrice).toString();
};
