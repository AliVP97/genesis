import { stationNames as busStationNames } from 'utils/static/bus';
import styles from '../styles.module.scss';
import { IFaqContent, IResponseBusyRoute } from 'containers/landingPage/types';
import { LoadSearchResultContent, LoadSearchResultFaqContent } from '..';
import { ParsedUrlQuery } from 'querystring';
import { IBusyRoute, IContent, SERVICES } from '../types';

export const trainFaqGenerator = (text: string | undefined): Array<IFaqContent> => {
  return [
    {
      answer_text: `
        <p>بله؛ در بسیاری از قطارهای داخلی ایران، مانند قطار ${text} کوپه‌های مخصوص بانوان در نظر گرفته شده است. این امکان به بانوان اجازه می‌دهد تا سفر راحت‌تر و امن‌تری را تجربه کنند.</p>
      `,
      question: `آیا می‌توان برای سفر با قطار ${text}، کوپه مخصوص بانوان رزرو کرد؟`,
      id: 1,
    },
    {
      answer_text: `
        <p>بله؛ به طور کلی امکان استرداد بلیط قطار ${text} وجود دارد و قوانین آن به شرح زیر است:</p>
        <ul>
          <li>
            <p>استرداد زودهنگام (تا 12 ساعت مانده به حرکت قطار):<span>90 درصد هزینه بلیط به شما بازگردانده می‌شود.</span></p>
          </li>
           <li>
            <p>استرداد با تاخیر کمتر (12 تا 3 ساعت مانده به حرکت قطار):<span>70 درصد هزینه بلیط به شما تعلق می‌گیرد.</span></p>
            
          </li>
  
           <li>
            <p>استرداد در ساعات پایانی (3 ساعت مانده به حرکت قطار):<span>50 درصد هزینه بلیط به شما بازگردانده خواهد شد.</span></p>
          </li>

           <li>
            <p>استرداد پس از حرکت قطار:<span> متاسفانه پس از حرکت قطار، امکان استرداد بلیط وجود ندارد و کل هزینه بلیط سوخت می‌شود.</span></p>
          </li>
        </ul>
        `,
      question: `اگر بلیط قطار ${text} را خریداری کنیم، آیا می‌توانیم آن را استرداد کنیم؟`,
      id: 2,
    },

    {
      answer_text: `
      <p>بله؛ امکان رزرو کوپه دربست در بسیاری از قطارهای ${text} وجود دارد. این امکان به شما اجازه می‌دهد تا همراه با خانواده یا دوستان خود، سفری خصوصی و راحت‌تر را تجربه کنید.</p>
      `,
      question: `آیا می‌توان در قطارهای ${text} کوپه را به صورت دربست رزرو کرد؟`,
      id: 3,
    },

    {
      answer_text: `
      <p>خیر؛ چاپ بلیط قطار ${text} الزامی نیست. در اکثر موارد، شما می‌توانید با نشان دادن بلیط الکترونیکی خود روی گوشی همراه، کارت هوشمند یا هر دستگاه دیگری که کد QR بلیط روی آن نمایش داده شود، سوار قطار شوید. این روش، روشی سریع، آسان و سازگار با محیط زیست است.</p>
      `,
      question: `چاپ بلیط قطار برای سفر از  ${text} ضروری است یا خیر؟ `,
      id: 4,
    },
    {
      answer_text: `
      <p>هر مسافر در قطار ${text} می‌تواند با ابعاد مشخص و وزن محدود را به همراه داشته باشد. همچنین، یک کیف دستی کوچک نیز مجاز است. اما توجه داشته باشید که این ابعاد و وزن دقیق، ممکن است بین شرکت‌های ریلی مختلف و حتی بین انواع قطارها متفاوت باشد.</p>
      `,
      question: `محدودیت حمل بار در قطارهای ${text} چقدر است؟`,
      id: 5,
    },
  ];
};

const trainDetailsContent = (text: string | undefined): IContent => ({
  title: {
    body: (
      <div className={styles['main-container']}>
        <h1>رزرو و خرید آنلاین بلیط قطار {text}</h1>
      </div>
    ),
  },
  description: {
    body: (
      <div className={styles['main-container']}>
        <h1>رزرو و خرید آنلاین بلیط قطار {text}</h1>
        <p>
          رزرو آنلاین و خرید بلیط قطار {text} (کوپه‌ای، دربست، اتوبوسی و سریع‌السیر) را در هف‌هشتاد
          با بهترین قیمت و پشتیبانی 24 ساعته از رجا، فدک، نورالرضا انجام دهید.
        </p>
      </div>
    ),
  },
});

export const trainDetails = (text: string | undefined): Array<IBusyRoute> => {
  return [
    {
      title: `${text}`,
      routes: [
        {
          id: `${busStationNames['41310000']}-${busStationNames['93310000']}`,
          title: `رزرو و خرید بلیط قطار  ${text} با بهترین قیمت | هف‌هشتاد`,
          href: `/bus/${busStationNames['41310000']}-${busStationNames['93310000']}`,
          content: trainDetailsContent(text),
        },
      ],
    },
  ];
};

export const trainStaticContent = (query: ParsedUrlQuery, content: IResponseBusyRoute) => ({
  loadSearchResultFaqContent: () => LoadSearchResultFaqContent(query, content, SERVICES.train),
  loadSearchResultContent: () => LoadSearchResultContent(query, content, SERVICES.train),
});
