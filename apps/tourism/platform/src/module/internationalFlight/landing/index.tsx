import { InternationalFlightApp } from 'assets/images';
import CompanyAdvice from 'containers/landingPage/components/companyAdvice';
import Download from 'containers/landingPage/components/download';
import Services from 'containers/landingPage/components/services';
import TrainDescription from './description';
import Magazine from 'containers/landingPage/components/magazine';
import FAQ from 'containers/landingPage/components/faq';
import Companies from 'containers/landingPage/components/companies';
import BusyRoutes from 'containers/landingPage/components/busyRoutes';
import { TabbedArticle } from 'containers/landingPage/components/tabbedArticle';
import {
  flightsAirLines,
  internationalFlightBusyLines,
  internationalFlightTabbedArticle,
  internationalFlightFaqs,
  internationalMagazine,
} from 'containers/landingPage/data';
import { SeoMeta } from 'components/seoMeta';
import { LandingPageType } from 'pages/bus';
import { mapSeoData } from 'components/seoMeta/helpers/mapSeoData';
import { useMemo } from 'react';

const DESCRIPTION = `
سفر به خارج از کشور هم می تواند مانند سایر سفرهای داخلی شما بدون اضطراب و نگرانی باشد. آشنایی با فرهنگ و آداب و رسوم یک کشور دیگر لذت بزرگی است. اما قبل از سفر نکات ضروری را رعایت کنید تا سفر به شما بیشتر خوش بگذرد.
قبل از پرواز های خارجی باید حداقل دو الی سه ساعت قبل در فرودگاه های بین المللی مورد نظر حضور داشته باشید و مدارک شناسایی و پاسپورت خود را به کارشناسان بازرسی ارائه دهید و کارت پرواز خود را دریافت کنید.
قبل از سفر چند کپی از پاسپورت خود بگیرید.  اگر پاسپورت خود را گم کردید یک کپی از آن را برای ارائه داشته باشید. 
`;

function InternationalFlightLanding({ content }: LandingPageType) {
  const faqData = content?.faq;
  const seoData = content?.meta_seo;

  const internationalFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'برای پروازهای خارجی چند ساعت قبل باید در فرودگاه حاضر باشیم؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'پیشنهاد ما این است برای جلوگیری از اضطراب و نگرانی در طول سفر، حداقل دو الی سه ساعت قبل از پرواز در فرودگاه حضور داشته باشید تا مراحل دریافت کارت پرواز را با آرامش طی کنید.',
        },
      },
      {
        '@type': 'Question',
        name: 'چطور می توان بلیط پرواز خارجی را کنسل و یا استرداد کرد؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'لطفا برای اطلاع دقیق از شرایط و جریمه استرداد بلیط هواپیما خارجی یا تغییر در بلیط پرواز با پشتیبانی هف‌هشتاد تماس بگیرید.',
        },
      },
      {
        '@type': 'Question',
        name: 'آیا برای خرید بلیط ایرلاین‌های خارجی، نیاز به روش‌های پرداخت ارزی و یا کارت های اعتباری خواهم داشت؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'به هیچ وجه. شما هزینه‌ بلیط را به صورت ریالی و با کارت‌های شتابی که در دست دارید، تنها با داشتن رمز دوم کارت پرداخت می کنید و بلیط شما بلافاصله صادر خواهد شد و قابل استفاده خواهد بود.',
        },
      },
      {
        '@type': 'Question',
        name: 'وسایل ممنوعه در پرواز خارجی',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'حمل اقلام زیر به طور كلی با هواپیمای مسافری ممنوع است: انواع مواد آتش ‌زا، منفجره و سريع‌ الاشتعال انواع اسپری خوشبو كننده، پاك‌كننده، تافت كپسول و اسپری ‌های شيميايی تحت فشار مانند گاز اشك ‌آور، بيهوش ‌كننده، دفاع شخصی، گاز مايع و ... انواع مواد اسيدی و خورنده مانند سركه، آبليمو، اسيد و ... ورود اقلام زیر به داخل كابين هواپيما ممنوع است (این اقلام را می توانید در چمدان خود بگذارید و تحویل قسمت بار بدهید): انواع اشيا و ابزار برنده مانند تيغ موكت ‌بری، بطری، شيشه، چاقو، قيچی، ناخن ‌گير، تيغ جراحی، پنجه بكس، تيغ ‌اصلاح و اشيای مشابه انواع ابزار مانند پيچ ‌گوشتی، آچار، چكش، سيم، طناب و ... انواع اسلحه اسباب‌ بازی كه شباهت زيادی به اسلحه واقعی دارند انواع سلاح ‌های گرم مانند سلاح‌ نظامی، شكاری و ساچمه ‌زن انواع فشنگ جنگی',
        },
      },
      {
        '@type': 'Question',
        name: 'برای پروازهای خارجی چه مدارکی لازم است؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'برای سفر به خارج از کشور در درجه اول باید گذرنامه و پاسپورت معتبر به همراه داشته باشید. منظور از معتبر این است که حداقل ۶ ماه تا پایان اعتبار گذرنامه‌تان (تاریخ انقضا) باقی مانده باشد. برای سفر به بعضی کشورها در شرایط عادی نیازی به ویزا ندارید و برای بعضی کشورها ویزای فرودگاهی برای شما صادر می‌شود. یکی دیگر از مدارک مهمی که بعضی مسافران فراموش می کنند آن را به همراه داشته باشند، فیش پرداختی عوارض خروج از کشور است.',
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
            __html: JSON.stringify(internationalFaqSchema),
          }}
        />
      </SeoMeta>
      <div className="rtl">
        <div className="my-4">
          <Services />
        </div>
        <div className="my-4">
          <TabbedArticle data={content} staticData={internationalFlightTabbedArticle} />
        </div>
        <div className="my-4">
          <CompanyAdvice description={DESCRIPTION} fullDescription={<TrainDescription />} />
        </div>
        <br />
        <div className="my-4">
          <Download image={InternationalFlightApp} />
        </div>
        <br />
        <div className="my-4">
          <Magazine magazines={internationalMagazine} />
        </div>
        <br />
        <div className="my-4">
          <FAQ faqs={faqData} staticData={internationalFlightFaqs} />
        </div>
        <br />
        <div className="my-4">
          <Companies title="معرفی ایرلاین‌ها" companies={flightsAirLines} />
        </div>
        <br />
        <div className="my-3">
          <BusyRoutes
            title="مسیر های پرتردد برای خرید بلیط هواپیما خارجی"
            routes={internationalFlightBusyLines}
          />
        </div>
        <br />
      </div>
    </>
  );
}

export default InternationalFlightLanding;
