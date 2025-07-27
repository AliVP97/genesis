import { Passengers } from 'module/flights/tickets/ticket/searchTicket/interface';
import { locationState } from 'components/originDestination/interface';
import { FlightType } from 'module/flights/tickets/ticket/searchTicket';
import { TicketType } from 'module/flights/tickets/ticket/interface';
import { PassengerPayload, PassengerListPayload } from 'services/general/passenger/interface';
import { toLatin } from './numbers';
import { TInitialState } from 'module/train/tickets/components/searchTicket';
import { TrainType } from 'module/train/tickets/interface';
import { PassengerModel } from 'components/passenger/hooks/usePassenger';

export const passengerCountValidate = ({ adult, child, infant }: Passengers) => {
  const MAX_PASSENGERS = 9;
  if (adult < 1) {
    throw new Error('تعداد بزرگسالان نمی‌تواند کمتر از ۱ باشد.');
  }
  if (adult + child + infant > MAX_PASSENGERS) {
    throw new Error(`حداکثر تعداد مسافران ${MAX_PASSENGERS} نفر است.`);
  }
  if (infant < 0 || child < 0) {
    throw new Error('');
  }
  if (child + infant > adult * 3 || child > adult * 3) {
    throw new Error(
      'به ازای هر بزرگسال، همراهی حداکثر ۳ کودک مجاز است که تنها یکی از آن‌ها می‌تواند نوزاد باشد.',
    );
  }
  if (infant > adult) {
    throw new Error('تعداد نوزادها نمی‌تواند بیشتر از تعداد بزرگسالان باشد.');
  }
};

export const TRAIN_MAX_PASSENGER = 6;

export const trainPassengerValidation = ({ adult = 0, child = 0, infant = 0 }: Passengers) => {
  if (adult + child + infant > TRAIN_MAX_PASSENGER) {
    throw new Error(`حداکثر تعداد مسافران ${TRAIN_MAX_PASSENGER} نفر است.`);
  }
};

export const internationalFlightPassengerValidation = ({ adult, child, infant }: Passengers) => {
  const error = (message: string) => {
    throw new Error(message);
  };
  if (infant > adult) error(`به ازای هر نوزاد باید یک بزرگ سال وجود داشته باشد`);
  else if (child > 3 * adult) error(`به ازای هر سه کودک باید یک بزرگسال وجود داشته باشد`);
  else if (infant + child > 3 * adult)
    error(`به ازای هر بزرگسال، همراهی حداکثر ۳ کودک مجاز است که تنها یکی از آن‌ها می‌تواند نوزاد باشد.
`);
  else if (infant + child + adult > 9) error(`امکان انتخاب بیش از 9 مسافر وجود ندارد`);
};

export const ticketPassengerValidate = (
  passengers: PassengerListPayload,
  ticket: TicketType,
  selected: PassengerPayload['body'][],
) => {
  const adult = selected.filter((item) => item.ageType === 'AGE_TYPE_ADULT').length;
  const child = selected.filter((item) => item.ageType === 'AGE_TYPE_CHILD').length;
  const infant = selected.filter((item) => item.ageType === 'AGE_TYPE_INFANT').length;
  if (passengers.length >= 9) {
    throw new Error('حداکثر ۹ مسافر می‌توانید انتخاب کنید .');
  }
  if (ticket?.remainingSeats != null && passengers.length > ticket.remainingSeats) {
    throw new Error(
      `تعداد مسافران انتخاب شده مجاز نمی باشد، لطفا به تعداد صندلی خالی تیکت انتخاب شده مسافر انتخاب کنید ( ${ticket.remainingSeats} نفر )`,
    );
  }
  if (child + infant > adult * 3) {
    throw new Error(
      'به ازای هر بزرگسال، همراهی حداکثر ۳ کودک مجاز است که تنها یکی از آن‌ها می‌تواند نوزاد باشد.',
    );
  }
  if (infant > adult) {
    throw new Error('تعداد نوزادها نمی‌تواند بیشتر از تعداد بزرگسالان باشد.');
  }
};
export const trainTicketPassengerValidate = (
  passengers: PassengerListPayload,
  selected: PassengerPayload['body'][],
) => {
  const adult = selected.filter((item) => item.ageType === 'AGE_TYPE_ADULT').length;
  const child = selected.filter((item) => item.ageType === 'AGE_TYPE_CHILD').length;
  const infant = selected.filter((item) => item.ageType === 'AGE_TYPE_INFANT').length;
  if (passengers.length >= 9) {
    throw new Error('حداکثر ۹ مسافر می‌توانید انتخاب کنید .');
  }

  if ((child || infant) && adult == 0) {
    throw new Error('امکان انتخاب کودک و نوزاد بدون بزرگسال وجود ندارد');
  }
};

export const searchTicketValidate = (
  location: locationState,
  flightType: FlightType,
  date: [number | null, number | null],
) => {
  if (!location.origin.value) {
    throw new Error('مبدا را انتخاب کنید');
  }
  if (!location.destination.value) {
    throw new Error('مقصد را انتخاب کنید');
  }
  if (flightType === 'oneWay' && !date[0]) {
    throw new Error('تاریخ رفت رو انتخاب کنید');
  }
  if (flightType === 'roundTrip' && (!date[0] || !date[1])) {
    throw new Error('تاریخ رفت و برگشت را انتخاب کنید');
  }
};

export const searchHotelTicketValidate = (
  location: locationState,
  date: [number | null, number | null],
) => {
  if (!location.origin.value) {
    throw new Error('مقصد را انتخاب کنید');
  }
  if (!date[0] || !date[1]) {
    throw new Error('تاریخ رفت و برگشت را انتخاب کنید');
  }
};

export const validationMobile = (phoneNumber: string) => {
  phoneNumber = toLatin(phoneNumber);
  return /^(\+98|0)?9\d{9}$/.test(phoneNumber);
};

export const validationMobile2 = (phoneNumber: string) => {
  phoneNumber = toLatin(phoneNumber);
  return /^(98|0)?9\d{9}$/.test(phoneNumber);
};

type TMobileValidationOptions = { startWith?: ('\\+98' | '98' | '0')[] };

export const validateMobile = (phoneNumber: string, options?: TMobileValidationOptions) => {
  phoneNumber = toLatin(phoneNumber);

  const prefix = options?.startWith ? options?.startWith?.join('|') : '\\+98|98|0';

  const regexp = new RegExp(`^(${prefix})?9\\d{9}$`);

  return regexp.test(phoneNumber);
};

export const searchTrainValidate = (
  location: TInitialState,
  trainType: TrainType,
  date: [number | null, number | null],
) => {
  if (!location?.origin?.farsiName) {
    throw new Error('مبدا را انتخاب کنید');
  }
  if (!location?.destination?.farsiName) {
    throw new Error('مقصد را انتخاب کنید');
  }
  if (trainType === 'oneWay' && !date[0]) {
    throw new Error('تاریخ رفت رو انتخاب کنید');
  }
  if (trainType === 'roundTrip' && (!date[0] || !date[1])) {
    throw new Error('تاریخ رفت و برگشت را انتخاب کنید');
  }
};

export const domesticFlightTicketPassengerValidate = (
  passengers: PassengerListPayload,
  tickets: TicketType[],
) => {
  const adult = passengers.filter((item) => item.ageType === 'AGE_TYPE_ADULT').length;
  const child = passengers.filter((item) => item.ageType === 'AGE_TYPE_CHILD').length;
  const infant = passengers.filter((item) => item.ageType === 'AGE_TYPE_INFANT').length;
  if (passengers.length === 0) {
    throw new Error('لطفا مسافران خود را انتخاب نمایید');
  }
  if (passengers.length > 9) {
    throw new Error('حداکثر ۹ مسافر می‌توانید انتخاب کنید .');
  }
  if (
    tickets.length === 1 &&
    tickets[0]?.remainingSeats != null &&
    passengers.length > tickets[0].remainingSeats
  ) {
    throw new Error(
      `تعداد مسافران انتخاب شده از ظرفیت پرواز انتخابی شما بیشتر است\n` +
        `( ${tickets[0].remainingSeats} نفر )`,
    );
  }
  if (tickets.length === 2) {
    if (tickets[0]?.remainingSeats != null && passengers.length > tickets[0].remainingSeats) {
      throw new Error(
        `تعداد مسافران انتخاب شده از ظرفیت پرواز رفت انتخابی شما بیشتر است\n` +
          `( ${tickets[0].remainingSeats} نفر )`,
      );
    }
    if (tickets[1]?.remainingSeats != null && passengers.length > tickets[1].remainingSeats) {
      throw new Error(
        `تعداد مسافران انتخاب شده از ظرفیت پرواز برگشت انتخابی شما بیشتر است\n` +
          `( ${tickets[1].remainingSeats} نفر )`,
      );
    }
  }
  if (child + infant > adult * 3) {
    throw new Error('امکان انتخاب یک کودک / نوزاد بدون بزرگسال وجود ندارد');
  }
  if (infant > adult) {
    throw new Error('تعداد نوزادها نمی‌تواند بیشتر از تعداد بزرگسالان باشد.');
  }
};
export const domesticFlightTicketPassengerValidateV3 = (
  passengers: PassengerModel[],
  tickets: TicketType[],
) => {
  const adult = passengers.filter((item) => item.ageType === 'AGE_TYPE_ADULT').length;
  const child = passengers.filter((item) => item.ageType === 'AGE_TYPE_CHILD').length;
  const infant = passengers.filter((item) => item.ageType === 'AGE_TYPE_INFANT').length;
  if (passengers.length === 0) {
    throw new Error('لطفا مسافران خود را انتخاب نمایید');
  }
  if (passengers.length > 9) {
    throw new Error('حداکثر ۹ مسافر می‌توانید انتخاب کنید .');
  }
  if (tickets.length === 1 && passengers.length > tickets[0].remainingSeats!) {
    throw new Error(
      `تعداد مسافران انتخاب شده از ظرفیت پرواز انتخابی شما بیشتر است\n` +
        `( ${tickets[0].remainingSeats} نفر )`,
    );
  }
  if (tickets.length === 2) {
    if (passengers.length > tickets[0].remainingSeats!) {
      throw new Error(
        `تعداد مسافران انتخاب شده از ظرفیت پرواز رفت انتخابی شما بیشتر است\n` +
          `( ${tickets[0].remainingSeats} نفر )`,
      );
    }
    if (passengers.length > tickets[1].remainingSeats!) {
      throw new Error(
        `تعداد مسافران انتخاب شده از ظرفیت پرواز برگشت انتخابی شما بیشتر است\n` +
          `( ${tickets[1].remainingSeats} نفر )`,
      );
    }
  }
  if (child + infant > adult * 3) {
    throw new Error('امکان انتخاب یک کودک / نوزاد بدون بزرگسال وجود ندارد');
  }
  if (infant > adult) {
    throw new Error('تعداد نوزادها نمی‌تواند بیشتر از تعداد بزرگسالان باشد.');
  }
};
export const passportNoRegex = (passportNumber: string) => {
  return /^(?!^0+$)[a-zA-Z0-9]{6,9}$/.test(passportNumber);
};
export const emailRegex = (value: string) => {
  return /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(value);
};
