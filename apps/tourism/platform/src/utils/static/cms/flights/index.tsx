import { stationNames as busStationNames } from 'utils/static/bus';
import styles from '../styles.module.scss';
import { IFaqContent, IResponseBusyRoute } from 'containers/landingPage/types';
import { ParsedUrlQuery } from 'querystring';
import { IBusyRoute, IContent, SERVICES } from '../types';
import { LoadSearchResultContent, LoadSearchResultFaqContent } from '..';

export const flightFaqGenerator = (text: string | undefined): Array<IFaqContent> => {
  return [
    {
      answer_text: `
        <p>برای پروازهای داخلی از جمله پروازهای ${text}، بار دستی معمولاً 7 کیلوگرم و بار چمدانی بین 20 تا 30 کیلوگرم مجاز است. برای جزئیات دقیق‌تر، با شرکت هواپیمایی خود تماس بگیرید.</p>
      `,
      question: `مقدار بار مجاز در پرواز ${text} چقدر است؟`,
      id: 1,
    },

    {
      answer_text: `
      <p>معمولا ایرلاین‌ها نرخ اضافه بار را برای هر کیلوگرم برابر با یک درصد مبلغ بلیط خریداری شده شما محاسبه می‌کنند؛ برای اطلاع دقیق‌تر لطفا با شرکت‌ هواپیمایی خود تماس بگیرید.</p>
    `,
      question: `میزان مبلغ جریمه اضافه بار در پرواز  ${text} چه قدر است؟`,
      id: 2,
    },

    {
      answer_text: `
    <p>معمولا هر ایرالاین‌ در پرواز ${text}، قوانین و نرخ جریمه متفاوت دارد و نمی‌توان عدد مشخصی بیان کرد؛ بهتر است برای اطلاع دقیق‌تر قبل از خرید بلیط، قوانین استرداد آن را مطالعه کنید.</p>
    `,
      question: `در صورت کنسلی بلیط هواپیمای ${text} میزان جریمه چقدر خواهد بود؟`,
      id: 3,
    },

    {
      answer_text: `
      <p>برای خرید بلیط هواپیما ${text} رفت و برگشت، باید در قسمت بالای باکس جستجوی بلیط، گزینه رفت و برگشت را فعال کنید و در تقویم قیمتی تاریخ رفت و برگشت خود را انتخاب کنید.</p>
      `,
      question: `برای خرید بلیط رفت و برگشت ${text} چه باید کرد؟`,
      id: 4,
    },

    {
      answer_text: `
      <p>چاپ کردن بلیط الزامی نیست، می‌توانید با ارائه تصویر بلیط در گوشی خود از گیت فرودگاه ${text} عبور کنید؛ فقط باید بلیط را در گوشی ذخیره و در طول سفر همراه داشته باشید.</p>
      `,
      question: `آیا می‌توان بدون پرینت کاغذی بلیط هواپیما ${text} و با نمایش در موبایل، سوار هواپیما شد؟`,
      id: 5,
    },
  ];
};

const flightDetailsContent = (text: string | undefined): IContent => ({
  title: {
    body: (
      <div className={styles['main-container']}>
        <h1>خرید و رزرو بلیط هواپیما {text}</h1>
      </div>
    ),
  },
  description: {
    body: (
      <div className={styles['main-container']}>
        <h1>خرید و رزرو بلیط هواپیما {text}</h1>
        <p>
          خرید و رزرو بلیط هواپیما {text}؛ قیمت لحظه‌ای و برنامه پروازهای سیستمی و چارتر {text} را
          از معتبرترین ایرلاین‌ها، با پشتیبانی حرفه‌ای در هف هشتاد ببینید.
        </p>
      </div>
    ),
  },
});

export const flightDetails = (text: string | undefined): Array<IBusyRoute> => {
  return [
    {
      title: `${text}`,
      routes: [
        {
          id: `${busStationNames['41310000']}-${busStationNames['93310000']}`,
          title: `قیمت، رزرو و خرید بلیط هواپیما پرواز ${text} | هف‌هشتاد`,
          href: `/bus/${busStationNames['41310000']}-${busStationNames['93310000']}`,
          content: flightDetailsContent(text),
        },
      ],
    },
  ];
};

export const flightStaticContent = (query: ParsedUrlQuery, content: IResponseBusyRoute) => ({
  loadSearchResultFaqContent: () => LoadSearchResultFaqContent(query, content, SERVICES.flight),
  loadSearchResultContent: () => LoadSearchResultContent(query, content, SERVICES.flight),
});
