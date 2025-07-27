export type Location = {
  code: string;
  farsiName: string;
};
export interface Passengers {
  adult: number;
  child: number;
  infant: number;
}
export interface SearchHistory {
  origin: Location;
  destination: Location;
  passenger: Passengers;
  departureDate: string;
}

export interface OptionTypes {
  value: string;
  title: string;
}

export const options: OptionTypes[] = [
  {
    value: 'earliestTime',
    title: 'زودترین',
  },
  {
    value: 'recentTime',
    title: 'دیرترین',
  },
  {
    value: 'lowPrice',
    title: 'ارزان ترین',
  },
];

export enum TabType {
  SEATS = 'SEATS',
  POLICY = 'POLICY',
  ROAT_DETAIL = 'ROAT_DETAIL',
  DETAIL = 'DETAIL',
}

export const mobileDetailOptions = [
  { label: 'جزییات بلیط', value: TabType.DETAIL },
  {
    label: 'قوانین استرداد',
    value: TabType.POLICY,
  },
];
export const detailOptions = [
  {
    label: 'پیش نمایش صندلی‌ها',
    value: TabType.SEATS,
  },
  {
    label: 'قوانین استرداد',
    value: TabType.POLICY,
  },
  {
    label: 'جزئیات مسیر',
    value: TabType.ROAT_DETAIL,
  },
];
