import { Passengers } from 'module/flights/tickets/ticket/searchTicket/interface';

export interface ItemProps {
  type: keyof Passengers;
  title: JSX.Element;
}

export const passengerCountItems: ItemProps[] = [
  {
    type: 'adult',
    title: (
      <>
        <span className="color-black text-weight-300">بزرگسال</span>{' '}
        <span className="text-3 color-grey-1">( ۱۲ سال به بالا )</span>
      </>
    ),
  },
  {
    type: 'child',
    title: (
      <>
        <span className="color-black text-weight-300">کودک</span>{' '}
        <span className="text-3 color-grey-1">( ۲ سال تا ۱۲ سال )</span>
      </>
    ),
  },
  {
    type: 'infant',
    title: (
      <>
        <span className="color-black text-weight-300">نوزاد</span>{' '}
        <span className="text-3 color-grey-1">(10 روز تا ۲ سال )</span>
      </>
    ),
  },
];
