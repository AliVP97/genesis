import { NumberSeparator } from 'utils/helpers/numbers';
import { tableSum } from '../tableColumns/tableSum';
import { addtionalServiceCount } from '../tableColumns/additionalServiceCount';
import { TPackageItem } from 'services/tour/register/interface';
import { tourPrices } from '../../../../hooks/tourTomanPrices';
import { formatPrice } from '../../../../hooks/formatPrices';

export const generateAdditionalServiceRow = (
  count: number,
  watcher: string,
  data: TPackageItem,
) => {
  const isOneDay = data?.dayCount === '1';

  if (!isOneDay && addtionalServiceCount(count) && count) {
    const numberOfPassengers = addtionalServiceCount(count);
    const pricePerPerson = formatPrice(
      tourPrices(data?.additionalServicePrice),
      tourPrices(data?.additionalServicePriceUsd),
    );

    let totalPrices = '';
    if (data?.additionalServicePriceUsd) {
      totalPrices += `${tableSum(data?.additionalServicePriceUsd, numberOfPassengers)}$ + `;
    }
    totalPrices += tableSum(data?.additionalServicePrice, numberOfPassengers);

    const formattedTotalPrice = NumberSeparator(totalPrices);

    return {
      'نوع مسافر': watcher && 'سرویس اضافه',
      'تعداد مسافر': String(numberOfPassengers),
      'قیمت هر نفر': pricePerPerson,
      'مجموع قیمت': formattedTotalPrice,
    };
  } else {
    return {};
  }
};
