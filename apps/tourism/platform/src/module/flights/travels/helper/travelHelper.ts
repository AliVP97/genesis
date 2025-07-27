import { ITripPassenger, TPassengerAgeType, TTrip } from '../interface';
import {
  TTripTypes,
  TrainTrip,
  TTrips,
  Order,
  OrderPassengerList,
  TripsTrips,
} from 'services/domestic/orders/interface';

import { DateState } from 'containers/datepicker/selectDate';
import dayjs from 'dayjs';
import { definitions } from 'types/shoppingorder';
import { definitions as RajaTrain } from 'types/rajatrain';
import { TrainOrder } from 'services/train/orders/interface';
import { GetOrder } from 'services/domestic/flight/interface';
import {
  TBusRefundStatus,
  TFlightTripPassengers,
  TFlightTripTickets,
  TTrainTicket,
} from 'services/trips/types';

export const ordersMapper = (orders: Array<TripsTrips>): Array<TTrip> => {
  return orders.map((orderItem: TripsTrips) => {
    let order: TTrip = { passengers: [], details: {} };
    switch (orderItem.type) {
      case 'TRIPTYPE_DOMESTIC_FLIGHT':
        const domesticFlightOrder = orderItem.data as Order;
        order = (domesticFlightOrder?.passengers as OrderPassengerList).reduce(
          (acc: TTrip, cur, index) => {
            if (index === 0) {
              acc.type = 'TRIPTYPE_DOMESTIC_FLIGHT';
              acc.price = domesticFlightOrder?.payment?.totalPrice;
              acc.orderNumber = domesticFlightOrder.orderNumber;
              acc.orderId = domesticFlightOrder.orderId;
              acc.issueDate = domesticFlightOrder.createdDate;
              acc.arrivalCity = cur?.tickets![0]?.flightInfo?.arrival?.airport?.city?.name?.farsi;
              acc.departureCity =
                cur?.tickets![0]?.flightInfo?.departure?.airport?.city?.name?.farsi;
              acc.departureTime = cur.tickets![0]?.flightInfo?.departure?.date;
              acc.ticketId = cur.tickets![0]?.ticketId;
              acc.details = {
                departureAirline: cur.tickets![0]?.flightInfo?.airline?.name,
                pnr: cur.tickets![0]?.pnr,
                departureIata: cur.tickets![0]?.flightInfo?.departure?.airport?.iata,
                arivalIata: cur.tickets![0]?.flightInfo?.arrival?.airport?.iata,
              };
              if (cur.tickets!.length > 1) {
                acc.hasReturn = true;
                acc.return = {
                  type: 'TRIPTYPE_DOMESTIC_FLIGHT',
                  arrivalCity: cur.tickets![1]?.flightInfo?.arrival?.airport?.city?.name?.farsi,
                  departureCity: cur.tickets![1]?.flightInfo?.departure?.airport?.city?.name?.farsi,
                  departurePrice: domesticFlightOrder.passengers
                    ?.reduce(
                      (total, current) =>
                        total + parseInt(current.tickets![1]?.payment?.totalPrice || '0'),
                      0,
                    )
                    .toString(),
                  departureTime: cur.tickets![1]?.flightInfo?.departure?.date,
                  ticketId: cur.tickets![1]?.ticketId,
                  details: {
                    departureAirline: cur.tickets![1]?.flightInfo?.airline?.name,
                    pnr: cur.tickets![1]?.pnr,
                    departureIata: cur.tickets![1]?.flightInfo?.departure?.airport?.iata,
                    arivalIata: cur.tickets![1]?.flightInfo?.arrival?.airport?.iata,
                  },
                };
              }
              acc.passengers = [];
            }
            acc.departurePrice = (
              parseInt(acc.departurePrice || '0') +
              parseInt(cur.tickets![0]?.payment?.totalPrice || '0')
            ).toString();
            acc.passengers?.push({
              firstName: cur?.passenger?.firstname?.farsi,
              lastName: cur.passenger?.lastname?.farsi,
              passengerType: cur.passenger?.passengerType,
              price: cur.tickets![0]?.payment?.price,
              ageType: cur.passenger?.ageType,
              tickets: cur.tickets,
            });
            return acc;
          },
          { details: {} },
        );
        break;
      case 'TRIPTYPE_TRAIN':
        const trainOrder = orderItem.data as TrainOrder;
        order = trainOrderMapper(trainOrder);
        break;
      default:
        break;
    }
    return order;
  });
};

export const flightOrderMapper = (orderData: GetOrder): TTrip => {
  let order: TTrip = { passengers: [], details: {} };
  const domesticFlightOrder = orderData as Order;
  order = (domesticFlightOrder?.passengers as OrderPassengerList).reduce(
    (acc: TTrip, cur, index) => {
      if (index === 0) {
        acc.type = 'TRIPTYPE_DOMESTIC_FLIGHT';
        acc.price = domesticFlightOrder?.payment?.totalPrice;
        acc.orderNumber = domesticFlightOrder.orderNumber;
        acc.orderId = domesticFlightOrder.orderId;
        acc.issueDate = domesticFlightOrder.createdDate;
        acc.arrivalCity = cur?.tickets![0]?.flightInfo?.arrival?.airport?.city?.name?.farsi;
        acc.departureCity = cur?.tickets![0]?.flightInfo?.departure?.airport?.city?.name?.farsi;
        acc.departureTime = cur.tickets![0]?.flightInfo?.departure?.date;
        acc.ticketId = cur.tickets![0]?.ticketId;
        acc.details = {
          departureAirline: cur.tickets![0]?.flightInfo?.airline?.name,
          pnr: cur.tickets![0]?.pnr,
          departureIata: cur.tickets![0]?.flightInfo?.departure?.airport?.iata,
          arivalIata: cur.tickets![0]?.flightInfo?.arrival?.airport?.iata,
        };
        if (cur.tickets!.length > 1) {
          acc.hasReturn = true;
          acc.return = {
            type: 'TRIPTYPE_DOMESTIC_FLIGHT',
            arrivalCity: cur.tickets![1]?.flightInfo?.arrival?.airport?.city?.name?.farsi,
            departureCity: cur.tickets![1]?.flightInfo?.departure?.airport?.city?.name?.farsi,
            departurePrice: domesticFlightOrder.passengers
              ?.reduce(
                (total, current) =>
                  total + parseInt(current.tickets![1]?.payment?.totalPrice || '0'),
                0,
              )
              .toString(),
            departureTime: cur.tickets![1]?.flightInfo?.departure?.date,
            ticketId: cur.tickets![1]?.ticketId,
            details: {
              departureAirline: cur.tickets![1]?.flightInfo?.airline?.name,
              pnr: cur.tickets![1]?.pnr,
              departureIata: cur.tickets![1]?.flightInfo?.departure?.airport?.iata,
              arivalIata: cur.tickets![1]?.flightInfo?.arrival?.airport?.iata,
            },
          };
        }
        acc.passengers = [];
      }
      acc.departurePrice = (
        parseInt(acc.departurePrice || '0') + parseInt(cur.tickets![0]?.payment?.totalPrice || '0')
      ).toString();
      acc.passengers?.push({
        firstName: cur?.passenger?.firstname?.farsi,
        lastName: cur.passenger?.lastname?.farsi,
        passengerType: cur.passenger?.passengerType,
        price: cur.tickets![0]?.payment?.price,
        ageType: cur.passenger?.ageType,
        tickets: cur.tickets,
      });
      return acc;
    },
    { details: {} },
  );

  return order;
};

export const filterOrdersByDate = (orders: TTrips, date: DateState): TTrips => {
  let newData: TTrips = [];
  if (date.from && date.to) {
    newData = orders.filter((el) => {
      return (
        Number(date.from) <= Number(el?.orderTime) * 1000 &&
        Number(el?.orderTime) * 1000 <= Number(date.to)
      );
    });
  }
  return newData;
};

export const filterOrdersByOrderNumber = (orders: TTrips, orderNumber: string): TTrips => {
  return orders.filter((el) => el.orderNumber?.startsWith(orderNumber));
};

export const filterOrdersByOriginDestination = (orders: TTrips, filter: string): TTrips => {
  return orders.filter(
    (el) =>
      el.destination?.includes(filter) ||
      el.source?.includes(filter) ||
      el.orderNumber?.startsWith(filter) ||
      el.title?.startsWith(filter),
  );
};

export const sortOrders = (orders: TTrips): TTrips => {
  return orders.sort((a, b) => b.orderTime!.localeCompare(a.orderTime!));
};

export const searchFiledValidator = (search: string): boolean => {
  return isNaN(Number(search));
};

interface IGetDateTimeDetailsReturn {
  date: string;
  hour: string;
  minute: string;
}
export const getDateTimeDetails = (dateInfo: string | undefined): IGetDateTimeDetailsReturn => {
  const dateTime = new Date(Number(dateInfo) * 1000);
  const date = dayjs(dateTime).calendar('jalali').format('YYYY/MM/DD');
  const hour = String(dateTime.getHours()).padStart(2, '0');
  const minute = String(dateTime.getMinutes()).padStart(2, '0');
  return { date: date, hour: hour, minute: minute };
};
interface IFilterTripType {
  tripType: TTripTypes;
}

export const generateGetTripFilter = (tripFilterType: string): IFilterTripType | undefined => {
  switch (tripFilterType) {
    case 'TRIPTYPE_TRAIN':
      return {
        tripType: 'Train',
      };
    case 'TRIPTYPE_DOMESTIC_FLIGHT':
      return {
        tripType: 'Flight',
      };
    case 'TRIPTYPE_BUS':
      return {
        tripType: 'Bus',
      };
    case 'TRIPTYPE_INTERNATIONAL_FLIGHT':
      return {
        tripType: 'International_Flight',
      };
    case 'HOTEL':
      return {
        tripType: 'Hotel',
      };
    case 'Tour':
      return {
        tripType: 'Tour',
      };
    default:
      return undefined;
  }
};

export const getFlightTicketStatus = (
  status: definitions['apishoppingorderTicketStatus'],
): string => {
  const PASSENGER_TICKET_STATUS = {
    TICKETSTATUS_REFUND_DONE: 'استرداد شده',
    TICKETSTATUS_UNDEFINED: 'نامشخص',
    TICKETSTATUS_ISSUED: '',
    TICKETSTATUS_REFUND_REQUESTED: 'استرداد درخواست شده',
    TICKETSTATUS_REFUND_PROCESSING: 'در حال بررسی',
    TICKETSTATUS_REFUND_CONFIRMED: 'استرداد شده',
    TICKETSTATUS_REFUND_REJECTED: 'استرداد رد شده',
    TICKETSTATUS_REFUND_FAILED: 'استرداد ناموفق',
  };
  return PASSENGER_TICKET_STATUS[status];
};

export const getPassengerAgeType = (ageType: TPassengerAgeType): string => {
  const PASSENGER_AGE_TYPE = {
    AGE_TYPE_UNDEFINED: 'تعیین نشده',
    AGE_TYPE_ADULT: 'بزرگسال',
    AGE_TYPE_CHILD: 'کودک',
    AGE_TYPE_INFANT: 'نوزاد',
    GENDER_TYPE_UNDEFINED: 'تعیین نشده',
    GENDER_TYPE_FEMALE: 'خانم',
    GENDER_TYPE_MALE: 'آقا',
    Gender_TYPE_RATHER_NOT_SAY: 'اعلام نشده',
  };
  return PASSENGER_AGE_TYPE[ageType];
};

export const getBusRefundStatus = (status: TBusRefundStatus): string => {
  const BUS_REFUND_STATUS = {
    REFUND_STATUS_UNDEFINED: 'نامشخص',
    REFUND_STATUS_REQUESTED: 'درخواست استرداد',
    REFUND_STATUS_FAILED: 'استرداد ناموفق',
    REFUND_STATUS_REJECTED: 'استرداد رد شده',
    REFUND_STATUS_SUCCESSFUL: 'استرداد شده',
  };
  return BUS_REFUND_STATUS[status];
};

const mapTrainPassengers = (tickets: RajaTrain['rajaTrainTrip']['tickets']): ITripPassenger[] =>
  tickets!.map((item) => ({
    ageType: item.passenger?.genderType,
    firstName: item.passenger?.firstName,
    lastName: item.passenger?.lastName,
    passengerType: item.passenger?.genderType,
    price: item.price,
  }));

export const trainOrderMapper = (trainOrder: TrainOrder) => {
  return (trainOrder.trips as Array<TrainTrip>)?.reduce(
    (acc: TTrip, cur, index) => {
      if (index === 0) {
        acc.type = 'TRIPTYPE_TRAIN';
        acc.price = trainOrder?.price;
        acc.orderNumber = trainOrder.orderNumber;
        acc.orderId = trainOrder.orderId;
        acc.issueDate = trainOrder.createdAt;
        acc.arrivalCity = cur?.trainInfo?.destinationName;
        acc.departureCity = cur?.trainInfo?.originName;
        acc.departurePrice = trainOrder
          ?.trips![0]?.tickets?.reduce(
            (previous: number, current) => previous + parseInt(current?.price || '0'),
            0,
          )
          .toString();
        acc.departureTime = trainOrder?.trips![0]?.trainInfo?.departureDate;
        acc.details = {
          company: cur?.trainInfo?.companyName,
          serialNumber: cur?.trainInfo?.trackingId,
          trainInfo: {
            departure: trainOrder?.trips?.[0]?.trainInfo?.trainId as string,
            returning: trainOrder?.trips?.[1]?.trainInfo?.trainId as string,
          },
        };
        acc.passengers = trainOrder?.trips![0]?.tickets!.map((item): ITripPassenger => {
          return {
            ageType: item.passenger?.genderType,
            firstName: item.passenger?.firstName,
            lastName: item.passenger?.lastName,
            passengerType: item.passenger?.genderType,
            price: item.price,
          };
        });
        if (trainOrder?.trips!.length > 1) {
          acc.hasReturn = true;
          acc.departureCity = trainOrder?.trips![1]?.trainInfo?.destinationName;
          acc.return = {
            type: 'TRIPTYPE_TRAIN',
            arrivalCity: acc.departureCity,
            departureCity: trainOrder?.trips![1]?.trainInfo?.originName,
            departurePrice: trainOrder
              ?.trips![1]?.tickets?.reduce(
                (previous: number, current) => previous + parseInt(current?.price || '0'),
                0,
              )
              .toString(),
            departureTime: trainOrder?.trips![1]?.trainInfo?.departureDate,
            details: {
              company: trainOrder?.trips![1]?.trainInfo?.companyName,
              serialNumber: trainOrder?.trips![1]?.trainInfo?.trackingId,
            },
            passengers: mapTrainPassengers(trainOrder?.trips![1]?.tickets),
          };
        }
      }
      return acc;
    },
    { details: {} },
  );
};

export const calculateDomesticFlightTicketTotalPrice = (tickets: TFlightTripTickets): number => {
  const result = tickets?.reduce((prev, curr) => prev + Number(curr?.payment?.totalPrice), 0);
  return result;
};

export const calculateDomesticFlightTicketPrice = (
  passengers: TFlightTripPassengers,
  type: number,
): number => {
  const result = passengers?.reduce(
    (prev, curr) => prev + Number(curr?.tickets![type].payment?.totalPrice),
    0,
  );
  return result;
};

export const getPassengerTripTotalPrice = (ticket: TTrainTicket) => {
  const total = Number(ticket.price || 0) + Number(ticket.option?.[0]?.price || 0);
  return total.toLocaleString();
};

export const TripMode = {
  TRIP_MODE_ROUND_TRIP: 2,
  TRIP_MODE_UNDEFINED: 0,
  TRIP_MODE_ONEWAY: 1,
};

export const TripModeConvertor = {
  2: 'TRIP_MODE_ROUND_TRIP',
  0: 'TRIP_MODE_UNDEFINED',
  1: 'TRIP_MODE_ONEWAY',
};
