import { OrderPassenger, OrderTicket } from 'services/domestic/orders/interface';
import moment from 'moment-jalaali';

moment.loadPersian({ usePersianDigits: false, dialect: 'persian-modern' });

export const orderTicketData = (detail: OrderTicket, passenger: OrderPassenger) => {
  if (detail && passenger) {
    const { flightInfo, payment, pnr, ticketNumber, status, orderNumber } = detail;
    const { firstname, lastname, passengerType, nationalCode, ageType } = passenger;
    const [departureDatePart, departureTimePart] = (flightInfo?.departure?.fullDateString &&
      flightInfo?.departure?.fullDateString.split(' - ')) || [0];
    const departureJalaliDate = moment(departureDatePart, 'jYYYY/jMM/jDD');
    const [arrivalDatePart, arrivalTimePart] = (flightInfo?.arrival?.fullDateString &&
      flightInfo?.arrival?.fullDateString.split(' - ')) || [0];
    const arrivalJalaliDate = moment(arrivalDatePart, 'jYYYY/jMM/jDD');
    let issueJalaliDate = null;
    if (detail?.issueDateString) {
      const [issueDatePart] = (detail?.issueDateString && detail?.issueDateString.split(' - ')) || [
        0,
      ];
      issueJalaliDate = issueDatePart;
    } else {
      const issueDate = moment(Number(detail?.issueDate) * 1000);
      issueJalaliDate = issueDate.format('jYYYY/jMM/jDD');
    }

    let ageLabel;

    if (ageType === 'AGE_TYPE_ADULT') {
      ageLabel = 'بزرگسال';
    } else if (ageType === 'AGE_TYPE_CHILD') {
      ageLabel = 'کودک';
    } else if (ageType === 'AGE_TYPE_INFANT') {
      ageLabel = 'نوزاد';
    } else {
      ageLabel = undefined;
    }

    return {
      departureCity: flightInfo?.departure?.airport?.city?.name?.farsi,
      arrivalCity: flightInfo?.arrival?.airport?.city?.name?.farsi,
      departureCityEnglish: flightInfo?.departure?.airport?.city?.name?.english,
      arrivalCityEnglish: flightInfo?.arrival?.airport?.city?.name?.english,
      flightNumber: flightInfo?.flightNumber,
      airlineName: flightInfo?.airline?.name,
      airlineCode: flightInfo?.airline?.code,
      departureAirport: flightInfo?.departure?.airport?.name?.farsi,
      arrivalAirport: flightInfo?.arrival?.airport?.name?.farsi,
      departureTerminal: flightInfo?.departure?.terminal,
      arrivalTerminal: flightInfo?.arrival?.terminal,
      flightClass: flightInfo?.flightClass,
      price: payment?.price,
      tax: payment?.tax,
      totalPrice: payment?.totalPrice,
      zeroRefund: payment?.packageZeroRefundAmount,
      discount: payment?.discount,
      pnr,
      isCharter: flightInfo?.isCharter,
      allowedBaggage: flightInfo?.allowedBaggage,
      ticketNumber,
      status,
      orderNumber,
      passengerType,
      nationalCode,
      passengerEnglishFName: firstname?.english,
      passengerEnglishLName: lastname?.english,
      name: firstname?.farsi,
      lastname: lastname?.farsi,
      age: ageLabel,
      departureCalender: departureJalaliDate.format('jYYYY dddd jD jMMMM'),
      departureTime: departureTimePart,
      arrivalCalender: arrivalJalaliDate.format('jYYYY dddd jD jMMMM'),
      arrivalTime: arrivalTimePart,
      issueDateCalender: issueJalaliDate,
    };
  }
  return {};
};
