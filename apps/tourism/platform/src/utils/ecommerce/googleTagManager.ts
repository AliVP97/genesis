/* eslint-disable @typescript-eslint/no-unused-vars */
import { ITrackEventParams } from './domain/models';

const resetEventParams = () => {
  return {
    ecommerce: {
      items: [],
    },
    event: '',
  };
};

export const createTrackingEvent = (params: ITrackEventParams, optional?: object) => {
  const { value, type } = params;
  if (typeof window !== 'undefined') {
    window.dataLayer = window?.dataLayer || [];
    const eventParams: { [key: string]: unknown } = {
      ecommerce: {
        ...optional,
        items: Array.isArray(value) ? value : [value],
      },
      event: type,
    };

    window?.dataLayer?.push(eventParams);
    window?.dataLayer?.push(resetEventParams());
  }
  return;
};
