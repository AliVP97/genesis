export interface OptionTypes {
  value: string;
  title: string;
}

export const options: OptionTypes[] = [
  {
    value: 'lowPrice',
    title: 'ارزان ترین',
  },
  {
    value: 'highPrice',
    title: 'گران ترین',
  },
  {
    value: 'earliestTime',
    title: 'زودترین',
  },
  {
    value: 'recentTime',
    title: 'دیرترین',
  },
];
