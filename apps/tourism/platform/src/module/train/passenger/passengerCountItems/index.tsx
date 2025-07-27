import { Passengers } from 'module/train/tickets/interface';

export interface ItemProps {
  type: keyof Passengers;
  title: JSX.Element;
  description?: JSX.Element;
  minPassenger?: number;
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
    minPassenger: 1,
  },
  {
    type: 'child',
    title: (
      <>
        <span className="color-black text-weight-300">کودک</span>{' '}
        <span className="text-3 color-grey-1">( ۲ تا ۱۲ سال )</span>
      </>
    ),
    minPassenger: 0,
  },
  {
    type: 'infant',
    title: (
      <>
        <span className="color-black text-weight-300">نوزاد</span>{' '}
        <span className="text-3 color-grey-1">(10 روز تا ۲ سال )</span>
      </>
    ),
    minPassenger: 0,
    description: (
      <span className="text-3">
        به مسافرانی که در رده سنی نوزاد قرار بگیرند صندلی تعلق نخواهد گرفت. مبلغ دریافت شده تنها
        بابت بیمه مسافر نوزاد می‌باشد.
      </span>
    ),
  },
];
