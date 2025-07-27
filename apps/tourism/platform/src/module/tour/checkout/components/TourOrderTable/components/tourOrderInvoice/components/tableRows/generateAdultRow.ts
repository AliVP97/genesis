import { NumberSeparator } from 'utils/helpers/numbers';
import { adultSum } from '../tableColumns/adultSum';
import { adultCount } from '../tableColumns/adultCount';
import { TTourGetCheckoutResponse } from 'services/tour/v2/checkout/type';
import { formatPrice } from '../../../../hooks/formatPrices';
import { tourPrices } from '../../../../hooks/tourTomanPrices';

export const generateAdultRow = (
  count: string,
  watcher: string,
  data: TTourGetCheckoutResponse,
) => {
  if (!count) return {};
  const isOneDay = data?.isOneDay;

  const passengerType = watcher ? 'بزرگسال' : '';
  const calculatedAdultCount = adultCount(count);
  const adultNo =
    calculatedAdultCount === 3 || calculatedAdultCount === 5
      ? calculatedAdultCount - 1
      : calculatedAdultCount;

  const hasAdult = adultNo > 0;
  const totalPriceUsd = '';

  const totalPrice = NumberSeparator(`${totalPriceUsd}${adultSum(String(adultNo), data)}`);

  return hasAdult
    ? {
        'نوع مسافر': passengerType,
        'تعداد مسافر': `${adultNo}`,
        'قیمت هر نفر': NumberSeparator(
          isOneDay
            ? formatPrice(
                tourPrices(data?.adultPriceSingle),
                // tourPrices(data?.adultSinglePriceUsd),
              )
            : adultCount(count) == 1
              ? formatPrice(
                  tourPrices(data?.adultPriceSingle),
                  // tourPrices(data?.adultSinglePriceUsd),
                )
              : formatPrice(
                  tourPrices(data?.adultPriceDouble),
                  // tourPrices(data?.adultSinglePriceUsd),
                ),
        ),

        'مجموع قیمت': totalPrice,
      }
    : {};
};
