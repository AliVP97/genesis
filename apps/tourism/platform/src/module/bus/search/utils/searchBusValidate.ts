import { TLocation } from '../types';

export const searchBusValidate = (location: TLocation, date: number | null) => {
  if (!location?.origin?.cityName) {
    throw new Error('مبدا را انتخاب کنید');
  }
  if (!location?.destination?.cityName) {
    throw new Error('مقصد را انتخاب کنید');
  }
  if (!date) {
    throw new Error('تاریخ را انتخاب کنید');
  }
};
