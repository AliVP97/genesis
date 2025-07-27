import {
  SearchAirportsResponse,
  GetDomesticTicketResponse,
  GetSearchIdResponse,
  GetSearchIDRequest,
  GetDomesticFlightCheckoutRespone,
  GetDomesticFlightCheckoutRequest,
  GetOrder,
  PaymentInfoResponse,
  GetDomesticTicketResponseV2,
  TFlightAddPassengerPayload,
  TDaysPrices,
  TFlightContents,
  TFlightAlertsResponse,
  TGetFlightAlertQuery,
  TUpdateFlightAlertBody,
  TUpdateFlightAlertResponse,
} from './interface';
import API from 'utils/routes/api';
import request from 'services/axios';
import { QueryFunctionContext } from 'react-query';
import axios from 'axios';
import { definitions } from '../../../types/shoppingorder';

export const searchAirport = async (ctx: QueryFunctionContext) => {
  const { data }: { data: SearchAirportsResponse } = await request.get(API.GET_AIRPORTS, {
    params: ctx.queryKey[1],
  });
  return data;
};

export const getTicketList = async (queryKey: string, signal: AbortSignal | undefined) => {
  const { data }: { data: GetDomesticTicketResponse } = await request.get(API.GET_DOMESTIC_TICKET, {
    params: { requestID: queryKey },
    signal,
  });
  return data;
};

export const getCheckout = async (options: GetDomesticFlightCheckoutRequest) => {
  const { data }: { data: GetDomesticFlightCheckoutRespone } = await request.post(
    API.ORDERS,
    options,
  );
  return data;
};

export const flightAddPassengers = async (payload: TFlightAddPassengerPayload) => {
  const { data }: { data: GetDomesticFlightCheckoutRespone } = await request.post(
    API.ORDERS + `/${payload.orderId}/addpassengers`,
    {
      passengerIds: payload.passengerIds,
    },
  );
  return data;
};

export const getOrder = async (ctx: QueryFunctionContext) => {
  const { data }: { data: GetOrder } = await request.get(API.ORDERS + `/${ctx.queryKey[1]}`);
  return data;
};

export const reserve = async (id: string) => {
  const { data }: { data: GetDomesticFlightCheckoutRespone } = await request.post(
    `${API.root}shoppingorder/v1/orders/${id}/reserve`,
  );
  return data;
};
export const reserveV2 = async (id: string, acceptPriceChange: boolean) => {
  const { data }: { data: GetDomesticTicketResponseV2 } = await request.post(
    `${API.ORDERSV2}/${id}/reserve/${acceptPriceChange}`,
  );
  return data;
};

export const getPaymentInfo = async (id: string) => {
  const { data }: { data: PaymentInfoResponse } = await request.get(API.ORDERS + `/${id}/payment`);
  return data;
};

export const prepareFlight = async (query: GetSearchIDRequest) => {
  const { data }: { data: GetSearchIdResponse } = await request.post(API.GET_UUID, {
    query: query.query,
  });
  return data;
};

export const getBusiestTransportServiceProviders = async () => {
  const { data }: { data: SearchAirportsResponse } = await request.get(
    API.GET_BUSIEST_TRANSPORT_SERVICE_PROVIDERS,
  );
  return data;
};

export const getDaysPrices = async (
  origin: string,
  destination: string,
  startDate: number,
  endDate: number,
) => {
  const { data }: { data: { calendarData?: TDaysPrices } } = await request.get(
    API.GET_DAYS_PRICES,
    {
      params: {
        departureIata: origin,
        arrivalIata: destination,
        startDate,
        endDate,
      },
    },
  );
  return data;
};

export const getFlightContents = async () => {
  const { data }: { data: TFlightContents } = await axios.get(
    `${process.env.NEXT_PUBLIC_CMS_DOMAIN}${API.CMS.GET_FLIGHT_CONTENTS}`,
  );
  return data;
};

export const getIntFlightContents = async () => {
  const { data }: { data: TFlightContents } = await axios.get(
    `${process.env.NEXT_PUBLIC_CMS_DOMAIN}${API.CMS.GET_INT_FLIGHT_CONTENTS}`,
  );
  return data;
};

export const getTrainContents = async () => {
  const { data }: { data: TFlightContents } = await axios.get(
    `${process.env.NEXT_PUBLIC_CMS_DOMAIN}${API.CMS.GET_TRAIN_CONTENTS}`,
  );
  return data;
};

export const getBusContents = async () => {
  const { data }: { data: TFlightContents } = await axios.get(
    `${process.env.NEXT_PUBLIC_CMS_DOMAIN}${API.CMS.GET_BUS_CONTENTS}`,
  );
  return data;
};

export const getHotelContents = async () => {
  const { data }: { data: TFlightContents } = await axios.get(
    `${process.env.NEXT_PUBLIC_CMS_DOMAIN}${API.CMS.GET_HOTEL_CONTENTS}`,
  );
  return data;
};

export const getFlightAlert = async (query: TGetFlightAlertQuery) => {
  const { data } = await request.get<TFlightAlertsResponse>(API.FLIGHT_ALERT, {
    params: query,
  });

  return data;
};

export const updateFlightAlert = async (body: TUpdateFlightAlertBody['body']) => {
  const { data } = await request.post(API.FLIGHT_ALERT, body);

  return data as TUpdateFlightAlertResponse;
};

export const getZeroRefund = async (ctx: QueryFunctionContext) => {
  const { data }: { data: definitions['shoppingorderGetZeroRefundResponse'] } = await request.get(
    API.ZERO_REFUND + `/${ctx.queryKey[1]}`,
  );
  return data;
};

export const postZeroRefund = async (id: string, flightIds: string[]) => {
  const { data }: { data: null } = await request.post(API.ZERO_REFUND + `/${id}`, {
    flightIds,
  });
  return data;
};

export const SelectedFlightsData = async (id: QueryFunctionContext) => {
  const { data } = await request.get(API.DOMESTIC_FLIGHT, {
    params: { flightId: id.queryKey[1] },
  });

  return data;
};
