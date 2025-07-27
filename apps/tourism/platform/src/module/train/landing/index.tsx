import { TrainApp } from 'assets/images';
import BusyRoutes from 'containers/landingPage/components/busyRoutes';
import Companies from 'containers/landingPage/components/companies';
import CompanyAdvice from 'containers/landingPage/components/companyAdvice';
import Download from 'containers/landingPage/components/download';
import FAQ from 'containers/landingPage/components/faq';
import Magazine from 'containers/landingPage/components/magazine';
import Services from 'containers/landingPage/components/services';
import { TabbedArticle } from 'containers/landingPage/components/tabbedArticle';
import {
  trainBusyLines,
  trainFaqs,
  trainLines,
  trainMagazine,
  trainTabbedArticle,
} from 'containers/landingPage/data';
import TrainDescription from './description';
import { SeoMeta } from 'components/seoMeta';
import { LandingPageType } from 'pages/bus';
import { mapSeoData } from 'components/seoMeta/helpers/mapSeoData';
import { useMemo } from 'react';

const DESCRIPTION = `
برای شروع سفر ریلی بدون استرس و نگرانی توصیه می کنیم حتما 30 تا 45 دقیقه زودتر از ساعت حرکت قطار در ایستگاه حضور داشته باشید. اگر چمدان های سنگین همراه خود دارید و یا نیاز به ویلچر دارید، قبل از ورود به ایستگاه می توانید با شماره تماس های مندرج بر روی بلیط قطار خود تماس بگیرید و درخواست استفاده از خدمات ترنسفر و ویلچر را بدهید. هم چنین می توانید پس از رسیدن به ایستگاه با ماموران راه آهن ایستگاه هماهنگ و درخواست کمک کنید.
مهم ترین کاری که باید انجام دهید پیدا کردن اطلاعات قطار خود و شماره ایستگاه و سکوی آن از روی مانیتور نمایش دهنده ساعات حرکت قطارها در راه آهن است.
`;
function TrainLandingPage({ content }: LandingPageType) {
  const faqData = content?.faq;
  const seoData = content?.meta_seo;

  const trainFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'آیا پس از خرید بلیط قطار ، امکان تغییر مشخصات فردی وجود دارد؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'خیر، باید بلیط خریداری شده کنسل شود و بلیط جدید صادر گردد.',
        },
      },
      {
        '@type': 'Question',
        name: 'چند ساعت قبل از حرکت قطار باید در ایستگاه حضور داشته باشیم؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'یک ساعت قبل از حرکت قطار، در راه آهن حضور داشته باشیدو این حضور الزامی است. همچنین ده دقیقه مانده به حركت، تمام درهای قطار بسته خواهد شد و بعد از بسته‌شدن درها برای جلوگیری از خطرات احتمالی، سوارشدن به قطار دیگر امكان‌پذیر نیست.',
        },
      },
      {
        '@type': 'Question',
        name: 'شرایط حمل خودرو با قطار چیست؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'حمل و نقل خودرو با قطار با خرید بلیط قطار مجزا در کلیه محورهای راه آهن به غیر از محورهای شمال قابل حرکت و بهره برداری می باشد. ظرفیت این واگن ها 10 الی 12 خودرو است و در حال حاضر در مسیر تهران به مشهد، بندرعباس، کرمان، اهواز، تبریز و همچنین اصفهان به بندرعباس و دیگر مسیرهایی نظیر مشهد – بندرعباس و بالعکس راه اندازی شده است.',
        },
      },
      {
        '@type': 'Question',
        name: 'شرایط بیمه قطار چگونه است؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'تمام مسافران قطار از لحظه‌ ورود به ایستگاه مبدا تا خروج از ایستگاه مقصد در برابر حوادث بیمه هستند. بیمه‌ حوادث مسافری شامل جبران هزینه‌های پزشکی و همچنین جبران نقص عضو یا فوت ناشی از حوادثی مانندآتش سوزی، تصادف، انفجار، خارج شدن قطار از ریل، مانور، سنگ‌پرانی و سایر حوادث احتمالی می‌شود.',
        },
      },
      {
        '@type': 'Question',
        name: 'در صورت مفقودی و فراموشی بلیط قطار، چه باید کرد؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'در صورت مفقودی و فراموشی بلیط، مسافر می‌تواند در زمان اداری به ایستگاه‌های راه‌آهن که سیستم آنلاین فروش بلیط دارند، مراجعه کند و دوباره بلیط را دریافت کند. همچنین به شرط حضور به‌موقع (حداکثر 45 دقیقه مانده به حرکت) در ایستگاه‌های راه‌آهن که سیستم فروش بلیط آنلاین دارند و در وقت اداری، بلیط المثنی طبق آیین‌نامه‌ مربوط صادر می‌شود. بلیط مفقودی باید از طریق شبکه‌ رایانه‌ای صادر شده و استرداد نشده باشد. صدور بلیط المثنی با 5 درصد قیمت کل بلیط، انجام می‌شود و در صورت مفقود شدن آن، بلیط‌ المثنی دیگری صادر نخواهد شد. درحال حاضر بلیط المثنی از طریق سیستم استرداد نمی‌شود. (استرداد بلیط المثنی فقط به شرط ارائه‌ بلیط اصلی و بلیط المثنی به صورت همزمان در ایستگاه‌های آنلاین و کلیه‌ نمایندگی‌های فروش و با هماهنگی مرکز یکپارچه فروش بلیط قطار انجام می‌شود.',
        },
      },
      {
        '@type': 'Question',
        name: 'قیمت بلیط برای کودک و نوزاد چگونه است؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'قیمت بلیط کودک نیم‌بها و نوزاد 10 درصد مبلغ بزرگسال است.',
        },
      },
      {
        '@type': 'Question',
        name: 'شرایط کنسل کردن و استرداد بلیط قطار چگونه است؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'شرایط استرداد و جریمه قیمت بلیط قطار با توجه به زمانی که تا حرکت قطار باقی مانده است تعیین می شود و مابقی آن به مسافر برمی گردد. تا ساعت 12 روز قبل از حرکت شامل 10 درصد جریمه می گردد. از ساعت 12 روز قبل از حرکت تا سه ساعت قبل از حرکت قطار شامل 30 درصد جریمه می شود. از سه ساعت مانده به حرکت قطار تا لحظه حرکت قطار شامل 50 درصد جریمه کنسلی می شود. استرداد بلیط پس از حرکت قطار وجود ندارد و کل هزینه بلیط مسافر سوخت می شود.',
        },
      },
      {
        '@type': 'Question',
        name: 'بعد از خرید بلیط قطار برای سوار شدن چه مدارکی لازم است؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'برای ورود به قطار لازم است که پرینت بلیط و کارت شناسایی معتبر، در صورت داشتن تخفیف جانباز یا خانواده شهدا، به همراه داشتن کارت معتبر مربوطه را ارائه دهید.',
        },
      },
      {
        '@type': 'Question',
        name: 'در راه آهن و هنگام سوار شدن به قطار چه مدارکی لازم است؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'شما برای ورود به قطار باید این مدارک را با خود به همراه داشته باشید: پرینت بلیط و کارت شناسایی معتبر. در صورت داشتن تخفیف جانباز یا خانواده شهدا، به همراه داشتن کارت معتبر مربوطه ضروری است.',
        },
      },
      {
        '@type': 'Question',
        name: 'مقدار بار مجاز در قطار چقدر است؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'هر مسافر می‌تواند وسایل ضروری سفر خود را همراه ببرد به شرط آن‌که حجم آن از ابعاد 75 سانتی متر و وزن 30 کیلوگرم تجاوز نکند. به عنوان مثال مسافر می‌تواند کیف‌دستی، بسته‌ و چمدان‌های کوچک محتوی لوازم شخصی، صندلی چرخ‌دار بیمار، کالسکه بچه و قفس کوچک پرندگان ریزجثه (حداکثر در ابعاد 40 سانتی‌متر) را به همراه داشته باشد.',
        },
      },
      {
        '@type': 'Question',
        name: 'آیا در طول سفر وعده غذایی وجود دارد؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'در صورتیکه هنگام خرید بلیط قطار بر روی شرایط تهیه بلیط، وعده غذایی ذکر شده باشد می توانید از دریافت آن در طول مسیر بهره مند شوید در غیر اینصورت در بسیاری از قطارها امکان خرید غذا بصورت جداگانه در طی مسیر نیز وجود دارد.',
        },
      },
    ],
  };

  const metaData = useMemo(() => {
    const { metaData } = mapSeoData(seoData);
    return metaData;
  }, [seoData]);

  return (
    <>
      <SeoMeta metaData={metaData}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(trainFaqSchema),
          }}
        />
      </SeoMeta>
      <div className="rtl">
        <div className="my-4">
          <Services />
        </div>
        <div className="my-4">
          <TabbedArticle data={content} staticData={trainTabbedArticle} />
        </div>
        <div className="my-4">
          <CompanyAdvice description={DESCRIPTION} fullDescription={<TrainDescription />} />
        </div>
        <br />
        <div className="my-4">
          <Download image={TrainApp} />
        </div>
        <br />
        <div className="my-4">
          <Magazine magazines={trainMagazine} />
        </div>
        <br />
        <div className="my-4">
          <FAQ faqs={faqData} staticData={trainFaqs} />
        </div>
        <br />
        <div className="my-4">
          <Companies title="معرفی خطوط ریلی" companies={trainLines} />
        </div>
        <br />
        <div className="my-3">
          <BusyRoutes title="مسیر های پرتردد برای خرید بلیط قطار" routes={trainBusyLines} />
        </div>
        <br />
      </div>
    </>
  );
}

export default TrainLandingPage;
