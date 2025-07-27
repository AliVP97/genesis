import { EitaaIcon, InstagramIcon, LinkedinIcon, MailIcon, WhatsappIcon } from 'assets/icons';

const baseURL = process.env.NEXT_PUBLIC_DOMAIN;

export const FOOTER_SERVICES = [
  {
    title: 'باشگاه هف‌هشتادیا',
    subItems: [
      { title: 'قرعه کشی', url: `${baseURL}780-club/lottery` },
      { title: 'شانس و جایزه', url: `${baseURL}780-club/chances` },
      { title: 'رای گیری', url: `${baseURL}780-club/vote` },
    ],
  },
  {
    title: 'خدمات مشتریان',
    subItems: [
      {
        title: 'قوانین و مقررات گردشگری',
        url: `${baseURL}tourism-terms`,
      },
    ],
  },
  {
    title: 'هف‌هشتاد',
    subItems: [
      { title: 'درباره‌ی ما', url: `${baseURL}about-us` },
      { title: 'مجله هف‌هشتاد', url: `${process.env.NEXT_PUBLIC_DOMAIN_URL}mag/`, noFollow: true },
      { title: 'سیاستنامه حریم خصوصی', url: `${baseURL}page/privacy` },
    ],
  },
];

export const MOBILE_FOOTER_SERVICES = {
  subItems: [
    {
      title: 'قوانین و مقررات گردشگری',
      url: `${baseURL}tourism-terms`,
    },
    { title: 'درباره‌ی ما', url: `${baseURL}about-us` },
    { title: 'مجله هف‌هشتاد', url: `${process.env.NEXT_PUBLIC_DOMAIN_URL}mag/`, noFollow: true },
    { title: 'سیاستنامه حریم خصوصی', url: `${baseURL}page/privacy` },
  ],
};

export const FOOTER_SOCIAL_NETWORK = [
  {
    icon: <InstagramIcon className="mx-1 me-lg-3" />,
    link: 'https://www.instagram.com/780ir/',
  },
  {
    icon: <EitaaIcon className="mx-1 me-lg-3" />,
    link: 'https://eitaa.com/HafHashtad_780',
  },
  {
    icon: <MailIcon className="mx-1 me-lg-3" />,
    link: 'mailto:support@780.ir',
  },
  {
    icon: <WhatsappIcon className="mx-1 me-lg-3" />,
    link: 'https://wa.me/982147800000?text=%D8%B3%D9%84%D8%A7%D9%85!%20%D9%85%D9%86%20%D8%A8%D9%87%20%D8%B1%D8%A7%D9%87%D9%86%D9%85%D8%A7%DB%8C%DB%8C%20%D9%86%DB%8C%D8%A7%D8%B2%20%D8%AF%D8%A7%D8%B1%D9%85',
  },
  {
    icon: <LinkedinIcon className="mx-1 me-lg-3" />,
    link: 'https://www.linkedin.com/company/-780-?trk=biz-companies-cym',
  },
];
