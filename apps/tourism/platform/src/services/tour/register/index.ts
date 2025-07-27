import { TTourContent, TTourLandingContent, TTourTableContent } from 'containers/landingPage/types';
import {
  TPayloadCounselingForm,
  TtourCreateOrderRequest,
  TtourContentResponse,
  TtourListResponse,
  TtourPackageListResponse,
} from 'services/tour/register/interface';
import { GateWaysResponse } from '../../domestic/flight/interface';
import { OrderDetailResponse, OrderPayload, OrderResponse } from '../../general/payment/interface';
import { QueryFunctionContext } from 'react-query';
import API from 'utils/routes/api';
import request from 'services/axios';
import { originalPlatform } from 'utils/helpers/originalPlatform';

export type TOtpVerify = {
  code: string;
  mobile_number: string;
};
export type TTourOrderDataCheck = {
  tour_id: string | undefined;
  program_id: string | undefined;
  first_name: string;
  last_name: string;
  mobile_number: string;
  hotel_name: string;
  email: string;
  adult_no: string;
  kids_no_with_bed: string;
  kids_no_without_bed?: string;
  baby_no: string;
  adult_price?: string;
  adult_price_single?: string;
  kids_price_with_bed?: string;
  kids_price_without_bed?: string;
  baby_price: string;
  additional_service_price?: string;
  additional_service_no?: string;
  description?: string;
  total_price: string;
  travel_type: string;
  from_date: string;
  to_date: string;
  national_code: string;
};
export type TTourOrder = {
  tour_id: string | undefined;
  program_id: string | undefined;
  first_name: string;
  last_name: string;
  email: string;
  adult_no: string;
  kids_no_with_bed: string;
  baby_no: string;
  adult_price: string;
  kids_price_with_bed: string;
  baby_price: string;
  description: string | undefined;
  total_price: string;
  travel_type: string;
  from_date: string;
  to_date: string;
  national_code: string;
} & {
  hotel_name?: string;
  passport_number?: string;
  passport_expire_date?: string;
  adult_price_single?: string;
  adult_no_single?: string;
  kids_no_without_bed: string;
  kids_price_without_bed?: string;
  additional_service_price?: string;
  additional_service_no?: string;
};

export type TGateway = {
  serviceId: number | undefined;
};

export type TOrderPayment = {
  orderId: string | undefined;
  gatewayId: number | undefined;
  callback: string | undefined;
};

const id = typeof window !== 'undefined' ? (localStorage.getItem('user_id') as string) : '';

export const TourCounselingForm = async (payload: TPayloadCounselingForm) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}tour/v1/contacts`;
  const { data } = await request.post(url, {
    fullName: payload.formData.full_name,
    mobile: payload.formData.mobile_number,
  });
  return data;
};

export const getTourLandingPrograms = async () => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}tour-backend/api/v1/tour/tour-list`;
  const { data }: { data: { service: { data: { tour: [TTourContent] } } } } =
    await request.get(url);
  return data;
};

export const getTourLanding = async () => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}tour/v1/tours`;
  const { data }: { data: TtourListResponse } = await request.get(url);
  return data;
};

export const getTourLandingContent = async (type?: string) => {
  const contentType = `${type ? `${type}-content` : 'tour'}`;
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}tour-backend/api/v1/tour/tour-content/${contentType}`;
  const { data }: { data: TTourLandingContent } = await request.get(url);
  return data;
};

export const getTourItemContent = async (name: string) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}tour-backend/api/v1/tour/${name}`;
  const { data }: { data: TTourContent } = await request.get(url);
  return data;
};
export const getTourPackageContent = async (tourId: string) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}tour/v1/tours/${tourId}/packages`;
  const { data }: { data: TtourPackageListResponse } = await request.get(url);
  return data;
};
export const getTourPackageExtra = async (tourId: string) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}tour/v1/tours/${tourId}/content`;
  const { data }: { data: TtourContentResponse } = await request.get(url);
  return data;
};

export const getTourTableContent = async () => {
  const url = `${process.env.NEXT_PUBLIC_CMS_DOMAIN}api/tour-programs`;
  const { data }: { data: TTourTableContent[] } = await request.get(url);
  return data;
};

export const getTourTableItemContent = async (itemId: number, tourId: number) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}tour-backend/api/v1/tour/tour-program/${itemId}/${tourId}`;
  const { data }: { data: TTourTableContent } = await request.get(url);
  return data;
};

export const createTourOtp = async (mobile_number: string) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}tour-backend/api/v1/otp/request`;
  const { data } = await request.post(url, {
    mobile_number,
  });
  return data;
};

export const verifyTourOtp = async (payload: TOtpVerify) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}tour-backend/api/v1/otp/verify`;
  const { data } = await request.post(url, {
    code: payload.code,
    mobile_number: payload.mobile_number,
    // headers: {
    //   time: Date.now(),
    // },
  });
  return data;
};

export const tourOrder = async (data: TTourOrder) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}tour-backend/api/v1/order/create`;
  const { data: orderData } = await request.post(url, data, {
    headers: {
      'Grpc-metadata-Device-ID': id,
      'Grpc-metadata-Original-Platform': originalPlatform(),
    },
  });
  return orderData;
};

export const tourOrderDataCheck = async (checkData: TTourOrderDataCheck | TTourOrder) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}tour-backend/api/v1/order/check`;
  const { data } = await request.post(url, checkData);
  return data;
};
export const tourPostOrder = async (checkData: TtourCreateOrderRequest) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}tour/v1/orders`;
  const { data } = await request.post(url, checkData);
  return data;
};

export const tourGetGateways = async ({ serviceId }: { serviceId: string }) => {
  const price = 0;
  const { data }: { data: GateWaysResponse } = await request.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}payment/v1/product/gateway?serviceId=${serviceId}&price=${price}`,
  );
  return data;
};

export const tourCreatePaymentOrder = async (body: OrderPayload) => {
  const { data }: { data: OrderResponse } = await request.post(
    // API.CREATE_PAYMENT_ORDER,
    `${process.env.NEXT_PUBLIC_BASE_URL}payment/v1/product/order`,
    body.payload,
  );
  return data;
};

export const getTourOrderDetail = async (ctx: QueryFunctionContext) => {
  const { data }: { data: OrderDetailResponse } = await request.get(
    process.env.NEXT_PUBLIC_BASE_URL + API.GET_ORDER_STATUS + `/${ctx.queryKey[1]}`,
  );
  return data;
};
