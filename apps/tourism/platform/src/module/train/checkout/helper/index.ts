import jwt_decode from 'jwt-decode';

import { trainOrderMapper } from 'module/flights/travels/helper/travelHelper';
import { ITripTrain } from 'module/flights/travels/interface';
import { TicketType, TrainTicketType } from 'module/train/tickets/interface';
import { TrainOrder } from 'services/train/orders/interface';
import { validateMobile } from 'utils/helpers/validations';
import { definitions } from 'types/rajatrain';

export const selectedTicketInfo = (order: TrainOrder): TicketType => {
  const tarinTicket = trainOrderMapper(order);

  return {
    companyName: (tarinTicket.details as ITripTrain).company,
    destinationName: tarinTicket.arrivalCity,
    originName: tarinTicket.departureCity,
    departureDate: tarinTicket.departureTime,
  };
};

export const getPassengerTotalPrice = (
  order: TrainOrder,
  ticket: TrainTicketType,
  ticketIndex: number,
) => {
  const total = order.trips?.[1]
    ? Number(ticket.price || 0) +
      Number(order?.trips?.[1]?.tickets?.[ticketIndex]?.price || 0) +
      Number(ticket.option?.[0]?.price || 0) +
      Number(order?.trips?.[1]?.tickets?.[ticketIndex]?.option?.[0]?.price || 0)
    : Number(ticket.price || 0) + Number(ticket.option?.[0]?.price || 0);

  return total.toLocaleString();
};

export const getCompartmentTotalPrice = (order: TrainOrder) => {
  const total = order.trips?.[1]
    ? Number(
        order.trips?.[0]?.trainInfo?.priceDetail?.find((item) => item.tariff === 'TARIFF_EMPTY')
          ?.totalPrice || 0,
      ) +
      Number(
        order.trips?.[1]?.trainInfo?.priceDetail?.find((item) => item.tariff === 'TARIFF_EMPTY')
          ?.totalPrice || 0,
      )
    : Number(
        order.trips?.[0]?.trainInfo?.priceDetail?.find((item) => item.tariff === 'TARIFF_EMPTY')
          ?.totalPrice || 0,
      );
  return total.toLocaleString();
};

export const trainTotalTicketsPrice = (order: TrainOrder) => {
  return order?.trips
    ?.map((x) => x.tickets)
    .flat()
    .reduce((pre, cur) => pre + Number(cur?.price), 0);
};

export const trainTotalTicketsOptionsPrice = (order: TrainOrder) => {
  return order?.trips
    ?.map((x) => x.tickets)
    .flat()
    .map((x) => x?.option)
    .flat()
    .reduce((pre, cur) => pre + Number(cur?.price), 0);
};

export const trainTicketsCompartmentTotalPrice = (order: TrainOrder) => {
  if (
    order.trips?.find((trip) =>
      trip.trainInfo?.priceDetail?.find((item) => item.tariff === 'TARIFF_EMPTY'),
    )
  ) {
    return order.trips
      ?.map((x) => x.trainInfo?.priceDetail?.find((item) => item.tariff === 'TARIFF_EMPTY'))
      .reduce((prev, cur) => prev + (cur ? Number(cur?.totalPrice) : 0), 0);
  } else {
    return 0;
  }
};

export const trainTicketsCompartmentTotalEmptyCount = (order: TrainOrder) => {
  if (
    order.trips?.find((trip) =>
      trip.trainInfo?.priceDetail?.find((item) => item.tariff === 'TARIFF_EMPTY'),
    )
  ) {
    return order.trips
      ?.map((x) => x.trainInfo?.priceDetail?.find((item) => item.tariff === 'TARIFF_EMPTY'))
      .reduce((prev, cur) => prev + (cur ? Number(cur?.count) : 0), 0);
  } else {
    return 0;
  }
};

export const getTrainTripTotalPrice = (order: TrainOrder, ticket: TicketType) => {
  let total = 0;
  const tripInfo = order.trips?.find((x) => x.trainInfo?.trainId == ticket.trainId);
  if (tripInfo) {
    const price = ticket.priceDetail?.reduce((prev, cur) => prev + Number(cur.totalPrice), 0);
    // const optionsPrice = tripInfo.tickets
    //   ?.map(x => x.option)
    //   .flat()
    //   .reduce((prev, cur) => prev + Number(cur?.price), 0);
    total = Number(price);
  }
  return total;
};

export const showOptionalServices = (ticket: definitions['rajaTrainTicket'] | undefined) => {
  let string = '';

  if (ticket?.option?.[0]?.name) {
    string += ticket.option[0].name;

    if (ticket?.freeOption) {
      string += '، ';
    }
  } else {
    if (!ticket?.freeOption) {
      string += '-';
    }
  }

  if (ticket?.freeOption) {
    string += ticket.freeOption?.reduce((prev, { name }) => prev + name, '');
  }

  return string;
};

export const tariff2AgeType: Record<definitions['rajaTariff'], string> = {
  TARIFF_UNSPECIFIED: '',
  TARIFF_ADULT: 'بزرگسال',
  TARIFF_CHILD: 'کودک',
  TARIFF_EMPTY: '',
  TARIFF_INFANT: 'نوزاد',
  TARIFF_ADULT_FOREIGN: 'بزرگسال',
  TARIFF_CHILD_FOREIGN: 'کودک',
  TARIFF_INFANT_FOREIGN: 'نوزاد',
};

export const phoneNumberFromJWT = () => {
  if (typeof window === 'undefined') {
    return '';
  }
  const jwtToken = localStorage.getItem('UATP');
  if (typeof jwtToken === 'string') {
    const { mobile } = jwt_decode<{ mobile?: string }>(jwtToken);

    if (typeof mobile === 'string') {
      if (validateMobile(mobile, { startWith: ['98'] })) {
        const mobileStartWithZero = '0' + mobile.slice(2, 12);

        return mobileStartWithZero;
      }

      return mobile;
    }
  }

  return '';
};
