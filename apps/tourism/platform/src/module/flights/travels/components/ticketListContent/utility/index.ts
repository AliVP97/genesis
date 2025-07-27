import { getDateTimeDetails } from 'module/flights/travels/helper/travelHelper';
import { TTrip } from 'services/domestic/orders/interface';

export const getTicketInfo = (order: TTrip): Array<ITicketInfoItem> => {
  const {
    date: dateCalender,
    minute: dateMinute,
    hour: dateHour,
  } = getDateTimeDetails(order?.orderTime);
  const info: Array<ITicketInfoItem> = [];
  if (order?.type === 'Tour') {
    info.push({
      title: 'مسیر / مقصد',
      value: order?.source || '--',
    });
  } else if (order?.type === 'Hotel') {
    info.push(
      {
        title: 'نام هتل:',
        value: order?.title || '--',
      },
      {
        title: 'شهر:',
        value: order?.source || '--',
      },
    );
  } else {
    info.push({
      title: 'مسیر:',
      value:
        order.roundTripMode == 'ROUND_TRIP_MODE_TWO_WAY'
          ? `${order.source} به ${order.destination} (رفت و برگشت)`
          : `${order.source} به ${order.destination}` || '--',
    });
  }
  info.push(
    {
      title: 'شماره سفارش:',
      value: order?.orderNumber || '--',
    },
    {
      title: 'تاریخ و ساعت سفارش:',
      value: `${dateHour}:${dateMinute} - ${dateCalender}` || '--',
    },

    {
      title: 'مبلغ پرداختی:',
      value: Number(order.price).toLocaleString() + ' ریال' || '--',
    },
  );

  return info;
};
