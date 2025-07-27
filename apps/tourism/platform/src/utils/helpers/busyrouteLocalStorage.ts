import { MouseEvent } from 'react';
import dayjs from 'dayjs';

import { BusyRoutesLinkProps } from 'utils/cms/components/busyRoutes/types';

export const BusyRoutesHandleClick = (
  item: BusyRoutesLinkProps,
  event: MouseEvent<HTMLDivElement> | undefined,
  pathname: string,
) => {
  event?.preventDefault();
  const code = item?.link?.split('/')[-1];
  const originFarsiName = item?.originFarsiName || item?.title?.split(' ')[2];
  const originCode = code?.split('-')[0];

  const destinationCode = code?.split('-')[1];
  const destinationFarsiName = item?.destinationFarsiName || item?.title?.split(' ')[3];
  const todayDate = dayjs().format('YYYY-MM-DD');

  if (
    !pathname.includes('bus') ||
    !pathname.includes('train') ||
    !pathname.includes('international')
  ) {
    localStorage.setItem(
      `last_search`,
      `[{"origin":{"value":"${originCode}","city":"${originFarsiName}"},"destination":{"value":"${destinationCode}","city":"${destinationFarsiName}"},"departureDate":"${todayDate}","passenger":{"adult":1,"child":0,"infant":0}}]`,
    );
  }
  if (pathname.includes('international')) {
    localStorage.setItem(
      `international_flight_last_search`,
      `[{"origin":{"value":"${originCode}","city":"${originFarsiName}", "type":{"title": "${originCode}"}},"destination":{"value":"${destinationCode}","city":"فرودگاه بین المللی ${item?.title}", "type":{"title": "${destinationCode}"}},"departureDate":"${todayDate}","passenger":{"adult":1,"child":0,"infant":0},"cabinType":"CABIN_TYPE_ECONOMY"}]`,
    );
  }
};
