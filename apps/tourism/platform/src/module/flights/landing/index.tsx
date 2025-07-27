import { DomesticFlightApp } from 'assets/images';
import BusyRoutes from 'containers/landingPage/components/busyRoutes';
import Companies from 'containers/landingPage/components/companies';
import CompanyAdvice from 'containers/landingPage/components/companyAdvice';
import Download from 'containers/landingPage/components/download';
import FAQ from 'containers/landingPage/components/faq';
import Magazine from 'containers/landingPage/components/magazine';
import Services from 'containers/landingPage/components/services';
import { TabbedArticle } from 'containers/landingPage/components/tabbedArticle';
import {
  flightBusyLines,
  flightMagazine,
  flightsAirLines,
  flightTabbedArticle,
  flightFaqs,
} from 'containers/landingPage/data';
import { SeoMeta } from 'components/seoMeta';
import { LandingPageType } from 'pages/bus';
import { mapSeoData } from 'components/seoMeta/helpers/mapSeoData';
import { useMemo } from 'react';

const DESCRIPTION = `خدمات آنلاین برای مشتریان این امکان را فراهم می‌کند تا با صرفه‌جویی در وقت اقدام به جستجو و مقایسه خدمات گردشگری نمایند چه بسا که بسیاری از آژانس‌های مسافرتی هنوز از شیوه‌های سنتی رزرواسیون استفاده می‌کنند. ما در 780 می‌دانیم که همه شرکت‌های هواپیمایی یکسان نیستند به همین دلیل است که همه مسیرهای هوایی و ترکیبات موجود را به شما نشان می‌دهیم تا بتوانید پرواز خود را با بهترین قیمت رزرو کنید.`;
const FULL_DESCRIPTION = `خدمات آنلاین برای مشتریان این امکان را فراهم می‌کند تا با صرفه‌جویی در وقت اقدام به جستجو و مقایسه خدمات گردشگری نمایند چه بسا که بسیاری از آژانس‌های مسافرتی هنوز از شیوه‌های سنتی رزرواسیون استفاده می‌کنند. ما در 780 می‌دانیم که همه شرکت‌های هواپیمایی یکسان نیستند به همین دلیل است که همه مسیرهای هوایی و ترکیبات موجود را به شما نشان می‌دهیم تا بتوانید پرواز خود را با بهترین قیمت رزرو کنید. شما قادر خواهید بود که همه پیشنهادات و خدمات پروازی را با هم مقایسه کنید و تنها با چند کلیک آنچه به دنبالش هستید را بیابید. کافیست مبداء، مقصد و تاریخ‌های رفت و برگشت پرواز خود را انتخاب کنید تا موتور جستجوی ما ارزان‌ترین پرواز‌های موجود را برای شما نمایش دهد.`;

function FlightLandingPage({ content }: LandingPageType) {
  const faqData = content?.faq;
  const seoData = content?.meta_seo;

  const flightFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'آیا پس از خرید بلیط امکان اصلاح نام و یا تغییر نام مسافر وجود دارد ؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'در پرواز داخلی، امکان تغییر نام و نام خانوادگی در هنگام خرید بلیط سیستمی وجود ندارد. اما در بلیط های چارتر، برخی از چارترکننده‌ها اجازه ویرایش نام و اطلاعات مسافر را می دهند.در هنگام خرید اینترنتی بلیط هواپیما باید نام و نام خانوادگی با اطلاعات کارت شناسایی یکسان باشد.',
        },
      },
      {
        '@type': 'Question',
        name: 'آیا پس از خرید بلیط هواپیما امکان کنسلی آن وجود دارد؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'وقتی از هف‌هشتاد بهترین مرجع خرید بلیط ، بلیطتان را رزرو می‌کنید، آسوده خاطر باشید که امکان کنسل کردن بلیط وجود دارد. میزان جریمه را هم هنگام رزرو آنلاین بلیط هواپیما در قسمت قوانین استرداد بخوانید. میزان جریمه به نوع بلیط، کلاس پروازی، کلاس نرخی و... بستگی دارد.',
        },
      },
      {
        '@type': 'Question',
        name: 'چند روز قبل از پرواز، بلیط هواپیما را بخریم؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'از چند ماه قبل از سفر هم می توانید بلیط هواپیما خود را رزرو کنید. اما به این موضوع توجه کنید که در روزهای نزدیک به تاریخ سفرتان بلیط ها ارزان تر و پرتخفیف تر خواهد بود. اگر شرایط شما مناسب است و در روزهای شلوغ قصد سفر دارید بهتر است از چند هفته قبل بلیط خود را خریداری کنید.',
        },
      },
      {
        '@type': 'Question',
        name: 'قوانین حمل و سفر با حیوانات خانگی در پرواز داخلی چیست؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'سفر به همراه حیوان خانگی با هواپیما در کشورها و ایرلاین‌های مختلف قوانین متفاوتی دارد؛ برای مثال ورود حیوان خانگی به داخل کابین هواپیماهای داخلی ایران ممنوع است و در پروازهای داخلی لازم است حیوان خانگی خود را در پایانه فرودگاه تحویل دهید و در فرودگاه مقصد از سالن دریافت بار تحویل بگیرید. توجهه داشته باشید که داشتن مدارکی مثل شناسنامه و گواهی بهداشت حیوان خانگی برای شروع سفر، الزامی است.',
        },
      },
      {
        '@type': 'Question',
        name: 'آیا هنگام خرید پرواز داخلی به صورت آنلاین، امکان انتخاب صندلی وجود دارد ؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'خیر؛ هنگام خرید آنلاین بلیط هواپیما داخلی نمی توانید شماره صندلی خود را انتخاب کنید. اما هنگام دریافت کار پرواز در فرودگاه، می توانید محدوده صندلی خود را انتخاب کنید.',
        },
      },
      {
        '@type': 'Question',
        name: 'قیمت بلیط هواپیما برای کودکان و نوجوانان چگونه محاسبه می شود؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'قیمت بلیط هواپیما برای کودکان و نوزادان به کلاس پرواز و کلاس نرخی بستگی دارد. به صورت کلی، برخی ایرلاین ها قیمت بلیط مسافر کودک (2 الی 12 سال) را معادل 50 الی 100 درصد بلیط بزرگسال، و قیمت بلیط مسافر نوزاد (تا دو سال) 10 درصد بلیط بزرگسال محاسبه می کنند.',
        },
      },
      {
        '@type': 'Question',
        name: 'میزان بار مجاز در هر پرواز چقدر است ؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'مقدار مجاز بار در هر پرواز داخلی به کلاس پرواز و کلاس نرخی بلیط خریداری شده بستگی دارد. هنگام خرید اینترنتی بلیط هواپیما می‌توانید میزان بار مجاز را در جزییات بلیط ببینید. اگر میزان بارتان بیش از حد مجاز باشد، باید در فرودگاه هزینه ی اضافه بار را پرداخت کنید.',
        },
      },
    ],
  };

  const seoMetaData = useMemo(() => {
    const { metaData: mappedMetaData } = mapSeoData(seoData);
    return mappedMetaData;
  }, [seoData]);

  return (
    <>
      <SeoMeta metaData={seoMetaData}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(flightFaqSchema),
          }}
        />
      </SeoMeta>
      <div className="rtl">
        <div className="my-4">
          <Services />
        </div>
        <div className="my-4">
          <TabbedArticle data={content} staticData={flightTabbedArticle} />
        </div>
        <div className="my-4">
          <CompanyAdvice description={DESCRIPTION} fullDescription={FULL_DESCRIPTION} />
        </div>
        <br />
        <div className="my-4">
          <Download image={DomesticFlightApp} />
        </div>
        <br />
        <div className="my-4">
          <Magazine magazines={flightMagazine} />
        </div>
        <br />
        <div className="my-4">
          <FAQ faqs={faqData} staticData={flightFaqs} />
        </div>
        <br />
        <div className="my-4">
          <Companies title="معرفی ایرلاین‌ها" companies={flightsAirLines} />
        </div>
        <br />
        <div className="my-3">
          <BusyRoutes title="مسیرهای پر تردد برای خرید بلیط هواپیما" routes={flightBusyLines} />
        </div>
        <br />
      </div>
    </>
  );
}

export default FlightLandingPage;
