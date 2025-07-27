import { DomesticFlightApp } from 'assets/images';
import Download from 'containers/landingPage/components/download';
import FAQ from 'containers/landingPage/components/faq';
import Magazine from 'containers/landingPage/components/magazine';
import Services from 'containers/landingPage/components/services';
import { TabbedArticle } from 'containers/landingPage/components/tabbedArticle';
import { flightMagazine, flightTabbedArticle, flightFaqs } from 'containers/landingPage/data';
import { SeoMeta } from 'components/seoMeta';
import { LandingPageType } from 'pages/bus';
import { mapSeoData } from 'components/seoMeta/helpers/mapSeoData';
import { useMemo } from 'react';

function HomeLandingPage({ content }: LandingPageType) {
  const faqData = Array.isArray(content?.faq) ? content?.faq : content?.faq ? [content?.faq] : [];

  const seoData = content?.meta_seo;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'برای رزرو بلیط های لحظه آخری در هف‌هشتاد چه کار باید کنیم؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'برای این منظور اطلاعات خود و مسافران همراه را وارد کنید، تا بتوانید با سرعت بالاتری نسبت به سایر مسافران برای رزرو بلیط های لحظه آخری اقدام کنید.',
        },
      },
      {
        '@type': 'Question',
        name: 'آیا امکان استرداد بلیط وجود دارد؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'شما می توانید برای این منظور با کارشناسان هف‌هشتاد در تماس باشید. قوانین مربوط به کنسلی شرکت های سامانه حمل و نقل و هتلداری متفاوت است و امکان استرداد خدمات گردشگری موردنظر شما باید توسط تیم هف‌هشتاد بررسی شود. پشتیبانی 24 ساعته پاسخگوی شماست و در سریع ترین زمان شما را در جریان شرایط استرداد قرار می دهد.',
        },
      },
      {
        '@type': 'Question',
        name: 'آیا پس از خرید یا رزور خدمات امکان تغییر اطلاعات مسافر وجود دارد؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'این امر از سوی شرکت یا مرکز ارائه دهنده خدمات تعیین می شود. به عنوان مثال برخی از پروازهای چارتری امکان ویرایش نام و نام خانوادگی را به مسافر می دهند در حالی که بسیاری از پروازهای داخلی و خارجی این امکان را به مسافر نمی دهند. برای تغییر اطلاعاتی که برای خرید بلیط هواپیما، قطار، اتوبوس یا رزور هتل وارد کرده اید با کارشناسان هف‌هشتاد تماس بگیرید.',
        },
      },
      {
        '@type': 'Question',
        name: 'آیا با اخذ ویزای دبی به کمک هف‌هشتاد می توانید برای کار نیز اقدام کنیم؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ویزایی که هف‌هشتاد برای شما دریافت می کند یک ویزای گردشگری و توریستی است. شما می توانید از این ویزا برای سفرهای پژوهشی، دیدار اقوام یا گشت وگذار در دبی استفاده کنید اما این ویزا به شما اجازه کار یا تحصیل در دبی را نمی دهد.',
        },
      },
      {
        '@type': 'Question',
        name: 'آیا تورهای هف‌هشتاد شامل بیمه می شوند؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: ' بله تمام مسافرانی که با تور در کنار هف‌هشتاد سفر می کنند بیمه می شوند.',
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
            __html: JSON.stringify(faqSchema),
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
      </div>
    </>
  );
}

export default HomeLandingPage;
