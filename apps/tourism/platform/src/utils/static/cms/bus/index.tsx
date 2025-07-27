import { stationNames as busStationNames } from 'utils/static/bus';
import styles from '../styles.module.scss';
import { IFaqContent, IResponseBusyRoute } from 'containers/landingPage/types';
import { LoadSearchResultContent, LoadSearchResultFaqContent } from '..';
import { ParsedUrlQuery } from 'querystring';
import { IBusyRoute, IContent, SERVICES } from '../types';

export const busFaqGenerator = (text: string | undefined): Array<IFaqContent> => {
  return [
    {
      answer_text: `
      <p>بله؛ معمولاً امکان کنسل کردن بلیط اتوبوس ${text} وجود دارد. اما شرایط و میزان جریمه کنسلی بسته به قوانین شرکت مسافربری و زمان درخواست کنسلی متفاوت است</p>
    `,
      question: `آیا می‌توان بلیط اتوبوس ${text} را کنسل کرد؟`,
      id: 1,
    },

    {
      answer_text: `
        <p> انواع مختلفی از اتوبوس‌ها برای سفر از ${text} وجود دارد، از جمله:</p>
        <ul>
          <li>
            <p>اتوبوس‌های VIP: <span> این اتوبوس‌ها امکانات رفاهی بیشتری مانند صندلی‌های تخت‌شو، تلویزیون، اینترنت و... دارند.</span></p>
          </li>
  
           <li>
            <p>اتوبوس‌های معمولی: <span>این اتوبوس‌ها قیمت کمتری دارند و امکانات آن‌ها نیز ساده‌تر است.</span></p>
            
          </li>
  
           <li>
            <p>اتوبوس‌های شبانه: <span>برای سفرهای طولانی‌مدت، اتوبوس‌های شبانه مناسب هستند.</span></p>
          </li>
        </ul>
        `,
      question: `چه نوع اتوبوس‌هایی برای سفر از ${text} وجود دارد؟`,
      id: 2,
    },

    {
      answer_text: `
    <p>برای پیدا کردن بهترین قیمت‌ها و صندلی‌های دلخواه، بهتر است بلیط اتوبوس ${text} خود را به صورت آنلاین و چند روز قبل از سفر رزرو کنید. هرچه به زمان سفر نزدیک‌تر شوید، ممکن است قیمت‌ها افزایش یابد و صندلی‌های خالی نیز کمتر شود.</p>
    `,
      question: `بهترین زمان برای خرید بلیط اتوبوس ${text} چه زمانی است؟ `,
      id: 3,
    },

    {
      answer_text: `
        <p>بله، هر مسافر می‌تواند مقدار مشخصی بار با خود به داخل اتوبوس ${text} حمل کند. معمولاً محدودیت وزنی برای بار وجود دارد و بارهای اضافی هزینه جداگانه‌ای دارند.</p>
        `,
      question: `آیا می‌توان بار با خود به داخل اتوبوس ${text} برد؟`,
      id: 4,
    },

    {
      answer_text: `
      <p>در گذشته چاپ بلیط الزامی بود، اما امروزه با گسترش استفاده از گوشی‌های هوشمند، بیشتر شرکت‌های مسافربری امکان نمایش بلیط به صورت الکترونیکی را فراهم کرده‌اند. بنابراین، شما می‌توانید با نشان دادن بلیط اتوبوس ${text} روی گوشی خود، سوار اتوبوس شوید.</p>
      `,
      question: `آیا می‌توان بلیط اتوبوس ${text} را به صورت چاپی دریافت کرد؟`,
      id: 5,
    },
  ];
};

const busDetailsContent = (text: string | undefined): IContent => ({
  title: {
    body: (
      <div className={styles['main-container']}>
        <h1>رزرو و خرید آنلاین بلیط اتوبوس {text}</h1>
      </div>
    ),
  },
  description: {
    body: (
      <div className={styles['main-container']}>
        <h1>رزرو و خرید آنلاین بلیط اتوبوس {text}</h1>
        <p>
          رزرو آنلاین و خرید بلیط اتوبوس {text} (VIP و معمولی) را در هف‌هشتاد با بهترین قیمت،
          بیشترین ظرفیت و پشتیبانی 24 ساعته از شرکت های اتوبوسرانی انجام دهید.
        </p>
      </div>
    ),
  },
});

export const busDetails = (text: string | undefined): Array<IBusyRoute> => {
  return [
    {
      title: `${text}`,
      routes: [
        {
          id: `${busStationNames['41310000']}-${busStationNames['93310000']}`,
          title: `رزرو و خرید بلیط اتوبوس ${text} با بهترین قیمت | هف‌هشتاد`,
          href: `/bus/${busStationNames['41310000']}-${busStationNames['93310000']}`,
          content: busDetailsContent(text),
        },
      ],
    },
  ];
};

export const busStaticContent = (query: ParsedUrlQuery, content: IResponseBusyRoute) => ({
  loadSearchResultFaqContent: () => LoadSearchResultFaqContent(query, content, SERVICES.bus),
  loadSearchResultContent: () => LoadSearchResultContent(query, content, SERVICES.bus),
});
