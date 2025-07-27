import { NumberSeparator } from 'utils/helpers/numbers';
import { tableSum } from '../tableColumns/tableSum';
import { TPackageItem } from 'services/tour/register/interface';
import { formatPrice } from '../../../../hooks/formatPrices';
import { tourPrices } from '../../../../hooks/tourTomanPrices';

export const generateChildRow = (count: number, watcher: string, data: TPackageItem) => {
  if (!count || Number(count) === 0) return {};
  const isOneDay = data?.dayCount === '1';

  const passengerType = watcher && isOneDay ? 'کودک' : 'کودک با تخت';
  const pricePerPerson = NumberSeparator(
    formatPrice(tourPrices(data?.childPriceWithBed), tourPrices(data?.childPriceWithBedUsd)),
  );

  const totalPriceUsd = data?.childPriceWithBedUsd
    ? `${tableSum(data?.childPriceWithBedUsd, count)}$ +`
    : '';
  const totalPrice = NumberSeparator(
    `${totalPriceUsd} ${tableSum(data?.childPriceWithBed, count)}`,
  );

  return {
    'نوع مسافر': passengerType,
    'تعداد مسافر': `${count} `,
    'قیمت هر نفر': pricePerPerson,
    'مجموع قیمت': totalPrice,
  };
};
