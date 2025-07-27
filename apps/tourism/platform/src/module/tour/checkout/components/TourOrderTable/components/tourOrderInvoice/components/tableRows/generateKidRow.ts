import { NumberSeparator } from 'utils/helpers/numbers';
import { tableSum } from '../tableColumns/tableSum';
import { TPackageItem } from 'services/tour/register/interface';
import { tourPrices } from '../../../../hooks/tourTomanPrices';
import { formatPrice } from '../../../../hooks/formatPrices';

export const generateKidRow = (count: number, watcher: string, data: TPackageItem) => {
  if (!count || Number(count) === 0) return {};

  const passengerType = watcher ? 'کودک بدون تخت' : '';
  const pricePerPerson = NumberSeparator(
    formatPrice(tourPrices(data?.childPriceWithoutBed), tourPrices(data?.childPriceWithoutBedUsd)),
  );

  const totalPriceUsd = data?.childPriceWithoutBedUsd
    ? `${tableSum(data?.childPriceWithoutBedUsd, count)}$ +`
    : '';
  const totalPrice = NumberSeparator(
    `${totalPriceUsd} ${tableSum(data?.childPriceWithoutBed, count)}`,
  );

  return {
    'نوع مسافر': passengerType,
    'تعداد مسافر': `${count} `,
    'قیمت هر نفر': pricePerPerson,
    'مجموع قیمت': totalPrice,
  };
};
