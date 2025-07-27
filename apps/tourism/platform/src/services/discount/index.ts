import {
  ApplyDiscountResponse,
  RemoveDiscountResponse,
} from 'components/discount/types/discountTypes';
import request from 'services/axios';

export const applyDiscountOnOrder = async (
  url: string,
  discountCode: string,
): Promise<ApplyDiscountResponse> => {
  const { data }: { data: ApplyDiscountResponse } = await request.post(url, {
    discountCode,
  });
  return data;
};

export const removeDiscountFromOrder = async (url: string): Promise<RemoveDiscountResponse> => {
  const { data }: { data: RemoveDiscountResponse } = await request.delete(url);
  return data;
};
