import { TPassengerV2 } from 'services/general/passenger/interface';
import FareBreakdownV2 from '../types/FareBreakdownV2';
import PassengerTypeV2 from '../types/PassengerType';
import GetOrderResponseV2 from 'module/internationalFlight/checkout/types/GetOrderResponseV2';

export const checkPassengerNumbersValidity = (
  passengers: Array<TPassengerV2>,
  adultCount: number,
  childCount: number,
  infant: number,
): boolean => {
  if (passengers.length === childCount + adultCount + infant)
    if (
      passengers.filter((x) => x.ageType === 'AGE_TYPE_ADULT')?.length === adultCount &&
      passengers.filter((x) => x.ageType === 'AGE_TYPE_CHILD')?.length === childCount &&
      passengers.filter((x) => x.ageType === 'AGE_TYPE_INFANT')?.length === infant
    )
      return true;
  return false;
};

export const getInternationalFlightPassengerNumberByType = (
  fareBreakdowns: FareBreakdownV2[] | undefined,
  passengerType: PassengerTypeV2,
): number => {
  if (!fareBreakdowns) {
    return 0;
  }

  return fareBreakdowns.reduce(
    (prev, cur) => prev + (cur.passengerType === passengerType ? cur?.count || 0 : 0),
    0,
  );
};

export const checkValidity = (
  orderData: GetOrderResponseV2 | undefined,
  selectedPassengers: Array<TPassengerV2>,
) => {
  const { adult, child, infant } = getPassengersNumbers(orderData);
  if (selectedPassengers.length > adult + child + infant) {
    throw `انتخاب بیشتر از ${adult + child + infant} مسافر ( تعداد مسافر
            درخواستی شما ) مجاز نمیباشد.`;
  }
  if (
    (selectedPassengers.find((x) => x.ageType === 'AGE_TYPE_INFANT') ||
      selectedPassengers.find((x) => x.ageType === 'AGE_TYPE_INFANT')) &&
    !selectedPassengers.find((x) => x.ageType === 'AGE_TYPE_ADULT')
  ) {
    throw `امکان انتخاب یک کودک یا یک نوزاد به تنهایی وجود ندارد`;
  }
  if (!checkPassengerNumbersValidity(selectedPassengers, adult, child, infant)) {
    throw `جهت ادامه فرایند، ${adult} بزرگسال ${child > 0 ? `- ${child} کودک` : ''} ${
      infant > 0 ? `- ${infant} نوزاد` : ''
    } (تعداد مسافر درخواستی شما) باید انتخاب شود`;
  }
};

export const getPassengersNumbers = (
  orderData: GetOrderResponseV2 | undefined,
): IPassengerNumbers => {
  const passengers: IPassengerNumbers = {
    adult: 0,
    child: 0,
    infant: 0,
    total: 0,
  };
  if (!orderData) return passengers;

  const fareBreakdowns =
    (orderData?.order?.itinerary?.fareBreakdowns as FareBreakdownV2[] | undefined) ?? [];

  passengers.adult = fareBreakdowns?.reduce(
    (prev, cur) => prev + (cur.passengerType === 'ADULT' ? cur?.count || 0 : 0),
    0,
  );
  passengers.child = fareBreakdowns?.reduce(
    (prev, cur) => prev + (cur.passengerType === 'CHILD' ? cur?.count || 0 : 0),
    0,
  );
  passengers.infant = fareBreakdowns?.reduce(
    (prev, cur) => prev + (cur.passengerType === 'INFANT' ? cur?.count || 0 : 0),
    0,
  );
  passengers.total = passengers.adult + passengers.child + passengers.infant;
  return passengers;
};
