import { NumberSeparator } from 'utils/helpers/numbers';
import { tableSum } from '../tableColumns/tableSum';
import { TPackageItem } from 'services/tour/register/interface';
import { formatPrice } from '../../../../hooks/formatPrices';
import { tourPrices } from '../../../../hooks/tourTomanPrices';

export const generateBabyRow = (count: number, watcher: string, data: TPackageItem) => {
  if (!count || Number(count) === 0) return {};

  const passengerType = watcher ? 'نوزاد' : '';
  const pricePerPerson = NumberSeparator(
    formatPrice(tourPrices(data?.infantPrice), tourPrices(data?.infantPriceUsd)),
  );

  const totalPriceUsd = data?.infantPriceUsd ? `${tableSum(data?.infantPriceUsd, count)}$ +` : '';
  const totalPrice = NumberSeparator(`${totalPriceUsd} ${tableSum(data?.infantPrice, count)}`);

  return {
    'نوع مسافر': passengerType,
    'تعداد مسافر': `${count} `,
    'قیمت هر نفر': pricePerPerson,
    'مجموع قیمت': totalPrice,
  };
};
