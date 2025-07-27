import Image from 'next/image';
import cn from 'classnames';
import VisaPolicy from '../components/visaPolicy';
import { content } from '../content';
import {
  CalendarBlackIcon,
  TimeIcon,
  Info,
  PhoneOutlined,
  Visa780,
  Visa780Mobile,
} from 'assets/icons';
import OrderVisaCard from './components/orderVisaCard';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import styles from './dubaiVisa.module.scss';
import { SeoMeta } from 'components/seoMeta';
import FAQ from 'containers/landingPage/components/faq';
import VisaPriceTable from './components/visaPriceTable';
import { useWeb } from 'utils/hooks/useWeb';
import { HAFHASHTAD_TEL } from 'utils/static/global';
import { FC, useMemo } from 'react';
import parse from 'html-react-parser';
import { visaContentType } from 'services/visa/interface';
import { mapSeoData } from 'components/seoMeta/helpers/mapSeoData';

const VisaLandingPage: FC<visaContentType> = ({ visaContent }) => {
  const { isMobile } = useDeviceDetect();
  const isWeb = useWeb();
  const seoData = visaContent?.attributes?.meta_seo;

  const contentData = visaContent?.attributes;

  const metaData = useMemo(() => {
    const { metaData } = mapSeoData(seoData);
    return metaData;
  }, [seoData]);

  return (
    <div dir="rtl">
      <SeoMeta metaData={metaData} />
      <div className={cn(isMobile && 'mx-n3', 'text-center')}>
        <Image
          width={1920}
          height={528}
          src={`${process.env.NEXT_PUBLIC_CMS_DOMAIN}${contentData?.cover?.data?.attributes?.url}`}
          alt="visa"
        />
      </div>
      <div className={cn(!isMobile && 'container-lg')}>
        <div className={styles['visa-detail-container']}>
          <div className={styles['visa-detail-container__title']}>
            <Image
              className="rounded-2 border border-2 border-outline-var"
              src={`${process.env.NEXT_PUBLIC_CMS_DOMAIN}${contentData?.flag_image?.data?.attributes?.url}`}
              alt="visa-uae"
              width={90}
              height={50}
            />
            <h1 className={cn(isMobile ? 'fs-4 fw-500' : 'fs-5 fw-500')}>{contentData?.title}</h1>
          </div>
          <div className={styles['visa-detail-container__divider']} />
          {/* TODO: hide below section*/}
          {/*<div className={styles['visa-detail-container__warranty']}>*/}
          {/*  <div className="bg-color-blue-light-4 p-4 rounded-3 mt-3 text-center">*/}
          {/*    <VerifiedIcon />*/}
          {/*    <span className="color-primary fw-bold pe-2">*/}
          {/*      ضمانت بازپرداخت*/}
          {/*    </span>*/}
          {/*    <p className="color-primary-1 pt-3">*/}
          {/*      در صورت لغو ویزا توسط سفارت به دلیل COVID19، اگر قبلاً به*/}
          {/*      کنسولگری امارات متحده عربی درخواست نکرده باشید، هزینه شما را*/}
          {/*      بازپرداخت می‌کنیم.*/}
          {/*    </p>*/}
          {/*  </div>*/}
          {/*</div>*/}
          <div className="row mt-3">
            <div className="col-md-12 col-lg-6">
              <div className="bg-color-surface-container rounded-4 d-flex justify-content-lg-center justify-content-start align-items-center py-2 mb-2 pe-3 pe-lg-0">
                <div className={styles['visa-detail-container__icon']}>
                  <CalendarBlackIcon />
                </div>
                <div className="d-flex flex-column align-items-start pe-2">
                  <span className={cn('color-on-surface', isMobile ? 'fs-3' : 'fs-5 pb-1')}>
                    {contentData?.process?.title}
                  </span>
                  <span className={cn('color-on-surface-var', isMobile ? 'fs-2' : 'fs-3')}>
                    {contentData?.process?.caption}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-lg-6">
              <div className="bg-color-surface-container rounded-4 d-flex justify-content-lg-center justify-content-start align-items-center py-2 mb-2 pe-3 pe-lg-0">
                <div className={styles['visa-detail-container__icon']}>
                  <TimeIcon />
                </div>
                <div className="d-flex flex-column align-items-start pe-2">
                  <span className={cn('color-on-surface', isMobile ? 'fs-3' : 'fs-5 pb-1')}>
                    {contentData?.validity?.title}
                  </span>
                  <span className={cn('color-on-surface-var', isMobile ? 'fs-2' : 'fs-3')}>
                    {contentData?.validity?.caption}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row flex-column-reverse flex-lg-row">
          <div className="col-md-12 col-lg-9">
            <VisaPriceTable />
            <div className={styles['visa-detail-container__documents']}>
              {contentData?.visa_need_document?.title && (
                <span className="fw-bold py-1 fs-4">{contentData?.visa_need_document?.title}</span>
              )}
              <div className={cn(styles['visa-detail-container__divider'], 'my-3')} />
              {contentData?.visa_need_document?.process?.map((item) => (
                <div key={item.title}>
                  <VisaPolicy title={item.title} content={item.caption} />
                </div>
              ))}
            </div>
            {isWeb && (
              <>
                <div className={styles['visa-detail-container__documents']}>
                  <span className="fw-bold py-3">{contentData?.visa_need_process?.title}</span>
                  <div className={cn(styles['visa-detail-container__divider'], 'my-3')} />
                  {contentData?.visa_need_process?.process?.map((item) => (
                    <div key={item.title}>
                      <VisaPolicy title={item.title} content={item.caption} />
                    </div>
                  ))}
                  <div className={styles['visa-detail-container__documents__procedures']}>
                    <Info />
                    <span className="fw-bold">{contentData?.visa_need_process?.info?.title}</span>
                    {contentData?.visa_need_process?.info &&
                      parse(contentData?.visa_need_process?.info?.content)}
                  </div>
                </div>
                <FAQ staticData={content?.visaFAQ} faqs={contentData?.faq} />
                <div className="my-4">{contentData?.info && parse(contentData?.info)}</div>
                {contentData?.type_contents && parse(contentData?.type_contents)}
                {contentData?.pre_Instruction && (
                  <div className="bg-color-surface-container mt-4 px-4 py-3 rounded-4">
                    <h2 className="fs-5 fw-500">{contentData?.pre_Instruction?.title}</h2>
                    <div className="mt-3 d-flex justify-content-center">
                      <Image
                        className="rounded-3"
                        width={904}
                        height={472}
                        src={`${process.env.NEXT_PUBLIC_CMS_DOMAIN}${contentData?.pre_Instruction?.image?.data?.attributes?.url}`}
                        alt="visa"
                      />
                    </div>
                    <p className="mt-3 text-justify">
                      {parse(contentData?.pre_Instruction?.content)}
                    </p>
                  </div>
                )}
                <div className="my-4">{contentData?.content && parse(contentData?.content)}</div>
                {contentData?.price_information && (
                  <div className="my-4">
                    <div className="mt-4 py-3">
                      <h2 className="fs-5 fw-500">{contentData?.price_information?.title}</h2>
                      <div className="mt-3 d-flex justify-content-center">
                        <Image
                          className="rounded-3"
                          width={904}
                          height={472}
                          src={`${process.env.NEXT_PUBLIC_CMS_DOMAIN}${contentData?.price_information?.image?.data?.attributes?.url}`}
                          alt="visa"
                        />
                      </div>
                      <p className="mt-3 text-justify">
                        {parse(contentData?.price_information?.content)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="d-flex justify-content-center mb-5">
                  {isMobile ? <Visa780Mobile /> : <Visa780 />}
                </div>
              </>
            )}
          </div>
          <div className="col">
            <OrderVisaCard />
            <div className={styles['visa-detail-container__support-card']}>
              <p className="fw-bold color-on-surface">تماس با مشاوران هف‌هشتاد</p>
              <div className={styles['visa-detail-container__divider']} />
              <div className="text-center mt-3">
                <span className="fw-bold fs-3 color-on-surface-var">
                  خرید آسان با مشاوره تلفنی هف‌هشتاد
                </span>
                <p className="fs-3 mt-3 color-on-surface-var">شنبه تا چهارشنبه از ۹ الی ۱۷</p>
                <p className="fs-3 color-on-surface-var">پنجشنبه از ۹ تا ۱۳</p>
              </div>

              <div className="d-flex py-3 px-2 bg-color-surface-container color-primary justify-content-center align-items-center rounded-4 cursor-pointer">
                <PhoneOutlined className={styles['visa-detail-container__support-card__icon']} />
                <a
                  className="fs-5 pe-1 text-decoration-none"
                  href={`tel:${HAFHASHTAD_TEL}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  ۰۲۱-۴۷۸۰
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VisaLandingPage;
