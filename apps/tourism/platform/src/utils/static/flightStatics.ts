import { AirportsType } from 'services/domestic/flight/interface';

export const domesticBusiest: AirportsType = [
  {
    name: {
      farsi: 'فرودگاه مهرآباد',
      english: 'Mehrabad',
    },
    city: {
      name: {
        farsi: 'تهران',
        english: 'Tehran',
      },
    },
    iata: 'THR',
  },
  {
    name: {
      farsi: 'فرودگاه تبریز',
      english: 'Tabriz',
    },
    city: {
      name: {
        farsi: 'تبریز',
        english: 'Tabriz',
      },
    },
    iata: 'TBZ',
  },
  {
    name: {
      farsi: 'فرودگاه شهید دستغیب',
      english: 'Shiraz',
    },
    city: {
      name: {
        farsi: 'شیراز',
        english: 'Shiraz',
      },
    },
    iata: 'SYZ',
  },
  {
    name: {
      farsi: 'فرودگاه هاشمی نژاد مشهد',
      english: 'Mashhad',
    },
    city: {
      name: {
        farsi: 'مشهد',
        english: 'Mashhad',
      },
    },
    iata: 'MHD',
  },
  {
    name: {
      farsi: 'فرودگاه کیش',
      english: 'Kish Island',
    },
    city: {
      name: {
        farsi: 'کیش',
        english: 'Kish',
      },
    },
    iata: 'KIH',
  },
  {
    name: {
      farsi: 'فرودگاه اصفهان',
      english: 'Isfahan intl',
    },
    city: {
      name: {
        farsi: 'اصفهان',
        english: 'Isfahan',
      },
    },
    iata: 'IFN',
  },
  {
    name: {
      english: 'Ahwaz',
      farsi: 'فرودگاه اهواز',
    },
    city: {
      name: {
        farsi: 'اهواز',
        english: 'Ahwaz',
      },
    },
    iata: 'AWZ',
  },
];

export const iataToFarsi: { [key: string]: string } = {
  ABD: 'آبادان',
  AEU: 'ابو موسی‌',
  AKW: 'آغاجری',
  AWZ: 'اهواز',
  AJK: 'اراک',
  ADU: 'اردبیل',
  PGU: 'عسلویه',
  BBL: 'بابلسر',
  BXR: 'بم',
  BND: 'بندرعباس',
  BDH: 'بندر لنگه',
  XBJ: 'بیرجند',
  BSM: 'بیشه-کلا',
  BJB: 'بجنورد',
  BUZ: 'بوشهر',
  ZBR: 'چابهار',
  DEF: 'دزفول',
  FAZ: 'فسا',
  GBT: 'گرگان',
  HDM: 'همدان',
  HDR: 'هوادریا',
  IIL: 'ایلام',
  IHR: 'ایرانشهر',
  IFN: 'اصفهان',
  JYR: 'جیرفت',
  KLM: 'کلاله',
  KNR: 'کنگان',
  KKS: 'کاشان',
  KER: 'کرمان',
  KSH: 'کرمانشاه',
  KHA: 'خانه',
  KHK: 'خارک',
  KHD: 'خرم آباد',
  KHY: 'خوی',
  KIH: 'کیش',
  LFM: 'لامرد',
  LRR: 'لار',
  LVP: 'لاون',
  MRX: 'ماهشهر',
  MHD: 'مشهد',
  NSH: 'نوشهر',
  OMI: 'امیدیه',
  GSM: 'قشم',
  RJN: 'رفسنجان',
  RZR: 'رامسر',
  RAS: 'رشت',
  AFZ: 'سبزوار',
  ACP: 'مراغه',
  SDG: 'سنندج',
  CKT: 'سرخس',
  SRY: 'ساری',
  CQD: 'شهرکرد',
  SYZ: 'شیراز',
  SYJ: 'سیرجان',
  SXI: 'جزیره سیری',
  TCX: 'طبس',
  TBZ: 'تبریز',
  IKA: 'تهران',
  THR: 'تهران',
  OMH: 'ارومیه',
  AZD: 'یزد',
  ACZ: 'زابل',
  ZAH: 'زاهدان',
  JWN: 'زنجان',
  JAR: 'جهرم',
};
