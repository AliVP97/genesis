import { adultCount } from './adultCount';
import { TTourGetCheckoutResponse } from 'services/tour/v2/checkout/type';
import { tourPrices } from '../../../../hooks/tourTomanPrices';
import { formatPrice } from '../../../../hooks/formatPrices';

export const adultSumWithDollar = (adultNumber: string, data: TTourGetCheckoutResponse) => {
  const isOneDay = data?.isOneDay;
  const adultCountValue = adultCount(adultNumber) || 0;
  const adultPrice =
    isOneDay || adultCountValue === 1
      ? tourPrices(data?.adultPriceSingle)
      : tourPrices(data?.adultPriceDouble);
  const adultDollarPrice =
    isOneDay || adultCountValue === 1
      ? tourPrices(data?.adultPriceSingle)
      : tourPrices(data?.adultPriceDouble);
  const formattedPrice = formatPrice(adultPrice, adultDollarPrice);
  const totalAdultSum = adultCountValue * parseInt(formattedPrice);

  return totalAdultSum.toString();
};
