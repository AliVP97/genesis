import { SeoMetaRes } from 'components/seoMeta/types';
import { definitions, operations } from 'types/domestic-flight-aggregator';
import { definitions as paymentTypes } from 'types/payment';
import * as shoppingOrder from 'types/shoppingorder';

export type GetSearchIdResponse = definitions['aggregatorPrepareFlightListResponse'];

export type GetSearchIDRequest = definitions['aggregatorPrepareFlightListRequest'];

export type SearchAirportRequest = {
  query: string;
  domestic: boolean;
};

export type SearchAirportsResponse = definitions['aggregatorAirportSearchResponse'];

export type AirportType = definitions['domesticflightaggregatorAirport'];

export type AirportsType = definitions['domesticflightaggregatorAirport'][];

export type GetDomesticTicketRequest = {
  requestID: string;
};

export type GetDomesticTicketResponse = definitions['aggregatorFlightListResponse'];

export type GetDomesticTicketResponseV2 =
  shoppingOrder.definitions['apishoppingorderReserveResponse'];

export type GetDomesticFlightCheckoutRespone =
  shoppingOrder.definitions['apishoppingorderCreateOrderResponse'];

export type GetCheckoutDetail = shoppingOrder.definitions['apishoppingorderGetOrderResponse'];

export type GetDomesticFlightCheckoutRequest =
  shoppingOrder.definitions['apishoppingorderCreateOrderRequest'];

export type GetOrder = shoppingOrder.definitions['apishoppingorderGetOrderResponse'];

export type OrderTicket = shoppingOrder.definitions['apishoppingorderTicket'];

export type OrderPassengers = shoppingOrder.definitions['apishoppingorderOrderPassenger'][];

export type PaymentInfoResponse =
  shoppingOrder.definitions['apishoppingorderGetOrderPaymentInfoResponse'];

export type ContactInfoRequest = shoppingOrder.operations['Order_UpdateContactInfo'];

export type GateWaysResponse = paymentTypes['paymentGatewayResponse'];

export type TFlightAddPassengerPayload = {
  orderId: string;
  passengerIds: Array<string>;
};

export type TDaysPrices = definitions['aggregatorCalenderData'][];

export type TFlightContentsImage = {
  data: {
    attributes: {
      url: string;
      formats: {
        thumbnail: {
          url: string;
          name: string;
          hash: string;
          width: number | string;
          height: number | string;
        };
        small: {
          url: string;
          name: string;
          hash: string;
          width: number | string;
          height: number | string;
        };
      };
    };
  };
};

export type TFlightContentsTabs = {
  title: string;
  description: string;
}[];

export interface TFlightContentMoreInfo {
  data?: {
    attributes?: {
      title?: string;
      content?: string;
      short_content?: string;
      cover?: TFlightContentsImage;
      slug?: string;
    };
  }[];
}

export type TFlightContentsFaqs = {
  question: string;
  answer_text: string;
}[];

export interface TFlightContents {
  data: {
    attributes: {
      title: string;
      description: string;
      flight_refer_text: string;
      online_buy_ticket_text: string;
      cover: TFlightContentsImage;
      tabs?: TFlightContentsTabs;
      faq?: TFlightContentsFaqs;
      more_info?: TFlightContentMoreInfo;
      meta_seo?: SeoMetaRes;
    };
  }[];
}

export type TGetFlightAlertQuery = operations['Flight_AlertData']['parameters']['query'];
export type TFlightAlertsResponse = definitions['aggregatorAlertDataResponse'];

export type TUpdateFlightAlertBody = operations['Flight_SetAlert']['parameters']['body'];
export type TUpdateFlightAlertResponse = definitions['aggregatorSetAlertResponse'];
