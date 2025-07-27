import { HotelPassengers } from 'module/hotel/ticketsSearchBox/interface';

export const increasePassenger = (
  passengers: Array<HotelPassengers>,
  passenger: HotelPassengers,
  type: THotelPassengerType,
): Array<HotelPassengers> => {
  if (type === 'adult')
    return passengers.map((x) => (x === passenger ? { ...x, [type]: x[type] + 1 } : x));
  return passengers.map((x) =>
    x === passenger ? { ...x, child: [...x.child, { value: '' }] } : x,
  );
};

export const decreasePassenger = (
  passengers: Array<HotelPassengers>,
  passenger: HotelPassengers,
  type: THotelPassengerType,
): Array<HotelPassengers> => {
  if (type === 'adult')
    return passengers.map((x) =>
      x === passenger
        ? {
            ...x,
            [type]: x[type] > 1 ? x[type] - 1 : 1,
          }
        : x,
    );
  return passengers.map((x) => (x === passenger ? { ...x, child: [...x?.child.slice(0, -1)] } : x));
};

export const childTypeConvertor: Record<string, string> = {
  CHILD_1: 'کمتر از 1 سال',
  CHILD_2: '1 تا 2 سال',
  CHILD_3: '2 تا 3 سال',
  CHILD_4: '3 تا 4 سال',
  CHILD_5: '4 تا 5 سال',
  CHILD_6: '5 تا 6 سال',
  CHILD_7: '6 تا 7 سال',
  CHILD_8: '7 تا 8 سال',
  CHILD_9: '8 تا 9 سال',
  CHILD_10: '9 تا 10 سال',
  CHILD_11: '10 تا 11 سال',
  CHILD_12: '11 تا 12 سال',
};

export const checkValidate = (
  type: THotelPassengerType,
  hotelPassengerConfig: IPassengersHotelConfig,
  passenger: HotelPassengers,
) => {
  if (type === 'adult') {
    if (Number(hotelPassengerConfig?.limitAdults) <= passenger?.adult) {
      throw new Error(`امکان انتخاب بیش از ${hotelPassengerConfig?.limitAdults} مسافر
              بزرگسال وجود ندارد`);
    }
  } else if (type === 'child')
    if (Number(hotelPassengerConfig?.limitChildren) <= passenger?.child?.length) {
      throw new Error(`امکان انتخاب بیش از ${hotelPassengerConfig?.limitChildren} مسافر
              کودک وجود ندارد`);
    }
};
