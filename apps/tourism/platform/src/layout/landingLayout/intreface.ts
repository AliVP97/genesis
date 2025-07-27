export interface IFooterMenu {
  title: string;
  subMenu: Array<IFooterSubMenu>;
}

export interface IFooterSubMenu {
  title: string;
  link: string;
}

const baseURL = process.env.NEXT_PUBLIC_DOMAIN;

export const tourismMenu: IFooterMenu = {
  title: 'خدمات گردشگری',
  subMenu: [
    {
      title: 'پرواز داخلی',
      link: '/flights',
    },
    {
      title: 'بلیط قطار',
      link: '/train',
    },
    {
      title: 'بلیط اتوبوس',
      link: '/bus',
    },
    {
      title: 'پرواز خارجی',
      link: '/international',
    },
  ],
};

export const hafHashtadMenu: IFooterMenu = {
  title: 'باشگاه هف‌هشتاد',
  subMenu: [
    {
      title: 'شانس و جایزه',
      link: `${baseURL}780-club/chances`,
    },
    {
      title: 'رای گیری',
      link: `${baseURL}780-club/vote`,
    },
  ],
};
export const introduceMenu: IFooterMenu = {
  title: 'معرفی',
  subMenu: [
    {
      title: 'درباره ما',
      link: `${baseURL}about-us`,
    },
    {
      title: 'سیاست نامه حریم خصوصی',
      link: `${baseURL}page/privacy`,
    },
    {
      title: 'قوانین و مقررات عمومی گردشگری',
      link: `${baseURL}page/tourism-terms`,
    },
  ],
};
