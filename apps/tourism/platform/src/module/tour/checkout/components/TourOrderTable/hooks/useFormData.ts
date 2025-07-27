import { useRouter } from 'next/router';
import { FieldValues, UseFormGetValues } from 'react-hook-form';
import { TTourOrder } from 'services/tour/register';
import { addtionalServiceCount } from '../components/tourOrderInvoice/components/tableColumns/additionalServiceCount';
import { adultCount } from '../components/tourOrderInvoice/components/tableColumns/adultCount';
import { TTourGetCheckoutResponse } from 'services/tour/v2/checkout/type';
import { tourPrices } from './tourTomanPrices';

export const useFormData = (
  data: TTourGetCheckoutResponse,
  totalSum: number,
  getValues: UseFormGetValues<FieldValues>,
  type: string,
): { formData: TTourOrder } => {
  const { query } = useRouter();
  const { tourId, itemId } = query;

  const commonData: TTourOrder = {
    tour_id: tourId?.toString() ?? '',
    program_id: itemId?.toString() ?? '',
    national_code: getValues('nationalCode'),
    first_name: getValues('firstName'),
    last_name: getValues('lastName'),
    email: getValues('email'),
    adult_no: adultCount(getValues('adultNumber')).toString(),
    kids_no_with_bed: getValues('childNumber') ?? '',
    kids_no_without_bed: getValues('childWithoutBedNumber') ?? '',
    baby_no: getValues('infantNumber') ?? '',
    adult_price: tourPrices(data?.adultPriceDouble)?.toString() ?? '',
    kids_price_with_bed: tourPrices(data?.childPriceWithBed)?.toString() ?? '',
    baby_price: tourPrices(data?.infantPrice)?.toString() ?? '',
    description: getValues('description') ?? '',
    total_price: totalSum.toString(),
    travel_type: data?.transport?.type ?? '',
    from_date: data?.startDate ?? '',
    to_date: data?.endDate ?? '',
  };

  const isOneDay = data?.isOneDay;
  const optionalData: Partial<TTourOrder> = {};
  if (!isOneDay) {
    optionalData.hotel_name = data?.accommodation?.name ?? '';
    optionalData.adult_price_single = tourPrices(data?.adultPriceSingle)?.toString() ?? '';
    optionalData.kids_no_without_bed = getValues('childWithoutBedNumber') ?? '';
    optionalData.kids_price_without_bed = tourPrices(data?.childPriceWithoutBed)?.toString() ?? '';
    optionalData.additional_service_price =
      tourPrices(data?.additionalServicePrice)?.toString() ?? '';
    optionalData.additional_service_no =
      addtionalServiceCount(getValues('adultNumber'))?.toString() ?? '';
  }

  if (type === 'INTERNATIONAL') {
    optionalData.passport_number = getValues('passportNo') ?? '';
    optionalData.passport_expire_date = (
      getValues(['ExpireYear', 'ExpireMonth', 'ExpireDay']) ?? []
    ).join('-');
  }

  const formData: TTourOrder = {
    ...commonData,
    ...optionalData,
  };

  return { formData };
};
