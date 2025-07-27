import { definitions } from 'types/tour';
export type TtourListResponse = definitions['tourListResponse'];
export type TtourList = definitions['apitourItem'];
export type TtourPackageListResponse = definitions['tourPackageListResponse'];

export type TPackageItem = definitions['tourPackageResponse'];
export type TtourCreateOrderRequest = definitions['tourCreateOrderRequest'];
export type TtourContentResponse = definitions['tourContentResponse'];

export type TtourServices = definitions['tourTourService'];

export interface TPayloadCounselingForm {
  formData: {
    full_name: string;
    mobile_number: string;
    service_name?: string;
  };
  counselingData: {
    slug: string;
    title: string;
    type: string;
  };
}
