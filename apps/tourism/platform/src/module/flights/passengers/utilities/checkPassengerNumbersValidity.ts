import { TPassengerV2 } from 'services/general/passenger/interface';
import {
  TInternationalFlightOrder,
  TInternationalFlightPassengerType,
} from 'services/internationalFlight/order/interface';
export const checkPassengerNumbersValidity = (
  passengers: Array<TPassengerV2>,
  adultCount: number,
  childCount: number,
  infant: number,
): boolean => {
  if (passengers.length === childCount + adultCount)
    if (
      passengers.filter((x) => x.ageType === 'AGE_TYPE_ADULT')?.length === adultCount &&
      passengers.filter((x) => x.ageType === 'AGE_TYPE_CHILD')?.length === childCount &&
      passengers.filter((x) => x.ageType === 'AGE_TYPE_INFANT')?.length === infant
    )
      return true;
  return false;
};

export const getInternationalFlightPassengerNumberByType = (
  orderData: TInternationalFlightOrder | undefined,
  passengerType: TInternationalFlightPassengerType,
): number => {
  if (!orderData) return 0;
  return orderData!.order!.itinerary!.fareBreakdowns!.reduce(
    (prev, cur) => prev + (cur.passengerType === passengerType ? cur?.count || 0 : 0),
    0,
  );
};

export const checkValidity = (
  orderData: TInternationalFlightOrder | undefined,
  selectedPassengers: Array<TPassengerV2>,
) => {
  const getPassengersNumbers = (
    orderData: TInternationalFlightOrder | undefined,
  ): IPassengerNumbers => {
    const passengers: IPassengerNumbers = {
      adult: 0,
      child: 0,
      infant: 0,
      total: 0,
    };
    if (!orderData) return passengers;
    passengers.adult = orderData!.order!.itinerary!.fareBreakdowns!.reduce(
      (prev, cur) => prev + (cur.passengerType === 'PASSENGER_TYPE_ADULT' ? cur?.count || 0 : 0),
      0,
    );
    passengers.child = orderData!.order!.itinerary!.fareBreakdowns!.reduce(
      (prev, cur) => prev + (cur.passengerType === 'PASSENGER_TYPE_CHILD' ? cur?.count || 0 : 0),
      0,
    );
    passengers.infant = orderData!.order!.itinerary!.fareBreakdowns!.reduce(
      (prev, cur) => prev + (cur.passengerType === 'PASSENGER_TYPE_INFANT' ? cur?.count || 0 : 0),
      0,
    );
    passengers.total = passengers.adult + passengers.child + passengers.infant;
    return passengers;
  };

  const { adult, child, infant } = getPassengersNumbers(orderData);

  if (selectedPassengers.length > adult + child + infant) {
    throw new Error(
      `انتخاب بیشتر از ${adult + child + infant} مسافر ( تعداد مسافر درخواستی شما ) مجاز نمیباشد.`,
    );
  }

  if (
    selectedPassengers.some((x) => x.ageType === 'AGE_TYPE_INFANT') &&
    !selectedPassengers.some((x) => x.ageType === 'AGE_TYPE_ADULT')
  ) {
    throw new Error(`امکان انتخاب یک کودک / نوزاد بدون بزرگسال وجود ندارد`);
  }

  if (!checkPassengerNumbersValidity(selectedPassengers, adult, child, infant)) {
    let message = `جهت ادامه فرایند، ${adult} بزرگسال`;

    if (child > 0) {
      message += ` - ${child} کودک`;
    }

    if (infant > 0) {
      message += ` - ${infant} نوزاد`;
    }

    message += ` (تعداد مسافر درخواستی شما) باید انتخاب شود`;

    throw new Error(message);
  }
};
