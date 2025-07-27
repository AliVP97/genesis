import { FieldValues, UseFormGetValues } from 'react-hook-form';
import { TTourGetCheckoutResponse } from 'services/tour/v2/checkout/type';
import { tableSum } from '../components/TourOrderTable/components/tourOrderInvoice/components/tableColumns/tableSum';
import { adultSum } from '../components/TourOrderTable/components/tourOrderInvoice/components/tableColumns/adultSum';
import { addtionalServiceCount } from '../components/TourOrderTable/components/tourOrderInvoice/components/tableColumns/additionalServiceCount';
import { persianToEnglishNumberWithCommas } from '../components/TourOrderTable/components/tourOrderInvoice/components/tableColumns/persianToEnglishNumberWithCommas';

const TOUR_SERVICE_ID = 177;
export const useTourPrice = (
  orderData: TTourGetCheckoutResponse,
  getValues: UseFormGetValues<FieldValues>,
  serviceId: number,
) => {
  if (serviceId !== TOUR_SERVICE_ID) {
    return {
      totalSum: 0,
      totalSumWithDollar: 0,
    };
  }
  const isOneDay = orderData?.isOneDay;
  const totalSum =
    Number(adultSum(getValues('adultNumber'), orderData)) +
    Number(
      tableSum(
        persianToEnglishNumberWithCommas(orderData?.childPriceWithBed as string),
        getValues('childNumber'),
      ),
    ) +
    Number(
      tableSum(
        persianToEnglishNumberWithCommas(orderData?.childPriceWithoutBed as string),
        getValues('childWithoutBedNumber'),
      ),
    ) +
    Number(
      tableSum(
        persianToEnglishNumberWithCommas(orderData?.infantPrice as string),
        getValues('infantNumber'),
      ),
    ) +
    (!isOneDay
      ? Number(
          tableSum(
            persianToEnglishNumberWithCommas(orderData?.additionalServicePrice as string),
            addtionalServiceCount(getValues('adultNumber')),
          ),
        )
      : 0);

  return {
    totalSum,
  };
};
