import { BusApp } from 'assets/images';
import BusyRoutes from 'containers/landingPage/components/busyRoutes';
import CompanyAdvice from 'containers/landingPage/components/companyAdvice';
import Download from 'containers/landingPage/components/download';
import FAQ from 'containers/landingPage/components/faq';
import Magazine from 'containers/landingPage/components/magazine';
import Services from 'containers/landingPage/components/services';
import { busMagazine, busBusyLines, busTabbedArticle, busFaqs } from 'containers/landingPage/data';
import BusDescription from './description';
import { TabbedArticle } from 'containers/landingPage/components/tabbedArticle';
import { SeoMeta } from 'components/seoMeta';
import { LandingPageType } from 'pages/bus';
import { mapSeoData } from 'components/seoMeta/helpers/mapSeoData';
import { useMemo } from 'react';
const DESCRIPTION = `سفر با اتوبوس می تواند بسیار لذت بخش و مقرون به صرفه باشد. لذت بردن از مسیر و تماشای مناظر طبیعی و کوه و جنگل از زیبایی های سفر با اتوبوس است. 
هنگام سفر با اتوبوس 45 دقیقه قبل از حرکت در ترمینال مورد نظر حضور داشته باشید. مدارک شناسایی و بلیط خود را برای سوار شدن به اتوبوس ارائه دهید. 
اگر بلیط اتوبوس VIP خریداری کرده اید، به نسبت اتوبوس های معمولی امکانات بیشتری دریافت خواهید کرد و صندلی های شما قابلیت تبدیل شدن به تخت را دارند.
توجه داشته باشید که هنگام سفر با اتوبوس وسایل خود را در یک ساک دستی و چمدان تفکیک کنید. فضای داخل اتوبوس محدود است و چمدان شما در قسمت بار قرار خواهد گرفت. پس وسایل شخصی، دارو، خوراکی و ... را در یک ساک دستی کوچک جای دهید که بتوانید آن را در کنار صندلی خود قرار دهید. 
`;

function BusLandingPage({ content }: LandingPageType) {
  const faqData = content?.faq;
  const seoData = content?.meta_seo;
  const busFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'آیا امکان خرید بلیط اتوبوس به صورت تلفنی وجود دارد؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'خیر. بهتر است شما برای خرید بلیط اتوبوس به صورت آنلاین و از طریق وبسایت و یا اپلیکیشن هف‌هشتاد اقدام کنید.',
        },
      },
      {
        '@type': 'Question',
        name: 'آیا با خرید اینترنتی بلیط اتوبوس به مسافرها بیمه مسافرتی تعلق می‌گیرد؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'بله. هزینه‌ای که شما بابت خرید بلیط اتوبوس پرداخت می‌کنید بیمه مسافرتی را هم شامل می‌شود. فقط باید دقت داشته باشید نام مسافری را که هنگام خرید وارد می‎کنید مطابق با شناسنامه مسافر باشد.',
        },
      },
      {
        '@type': 'Question',
        name: 'آیا هنگام سوار شدن به اتوبوس نیاز به ارائه پرینت بلیط است؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'برای استفاده از بلیط‌ اتوبوس، چاپ بلیط در دفتر تعاونی مربوطه با ارائه پیامک شماره بلیط و کارت شناسایی معتبر الزامی و قابل انجام است.',
        },
      },
      {
        '@type': 'Question',
        name: 'امکان به همراه داشتن حیوانات خانگی در داخل اتوبوس وجود دارد؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'طبق قوانین سازمان حمل‌ونقل امکان به همراه داشتن حیوانات خانگی هنگام سفر با اتوبوس وجود ندارد.',
        },
      },
      {
        '@type': 'Question',
        name: 'برای سوار شدن به اتوبوس چند ساعت قبل از حرکت در ترمینال حضور داشته باشیم؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'در صورتی که اتوبوس در ساعت مقرر حرکت نکند مسافر باید حداکثر 30 دقیقه قبل حرکت سرویس در ترمینال مبدا حضور داشته باشد.',
        },
      },
      {
        '@type': 'Question',
        name: 'مقدار بار مجاز هر مسافر در سفر با اتوبوس چقدر است؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'طبق قوانین سازمان حمل‌ونقل میزان بار مجاز 20 کیلوگرم است. البته برخی از تعاونی‌ها با دریافت هزینه، امکان حمل بار تا 40 کیلوگرم را نیز ارائه می‌دهند. همچنین یکی دیگر از مسائلی که در این زمینه باید مد نظر قرار بدهید، شرکت تعاونی بلیط اتوبوس شماست.',
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
            __html: JSON.stringify(busFaqSchema),
          }}
        />
      </SeoMeta>
      <div className="rtl">
        <div className="my-4">
          <Services />
        </div>
        <div className="my-4">
          <TabbedArticle data={content} staticData={busTabbedArticle} />
        </div>
        <div className="my-4">
          <CompanyAdvice description={DESCRIPTION} fullDescription={<BusDescription />} />
        </div>
        <br />
        <div className="my-4">
          <Download image={BusApp} />
        </div>
        <br />
        <div className="my-4">
          <Magazine magazines={busMagazine} />
        </div>
        <br />
        <div className="my-4">
          <FAQ faqs={faqData} staticData={busFaqs} />
        </div>
        <br />
        {/*<div className="my-4">*/}
        {/*  <Companies title="معرفی ایرلاین‌ها" companies={flightsAirLines} />*/}
        {/*</div>*/}
        {/*<br />*/}
        <div className="my-3">
          <BusyRoutes title="مسیر های پرتردد برای خرید بلیط اتوبوس" routes={busBusyLines} />
        </div>
        <br />
      </div>
    </>
  );
}

export default BusLandingPage;
