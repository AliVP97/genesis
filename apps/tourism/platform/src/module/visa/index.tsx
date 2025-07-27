import { FC, useEffect } from 'react';
import Image from 'next/image';
import cn from 'classnames';
import VisaPolicy from './components/visaPolicy';
import styles from './visaContainer.module.scss';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import VisaPageContent from './components/visaPageContent';
import VisaSection from './components/VisaSection';
import { VisaTracking } from 'utils/ecommerce/application/mappers/visa/events';
import { IVisa } from 'utils/ecommerce/application/mappers/visa/types';
import { useWeb } from 'utils/hooks/useWeb';
import { VisaLandingContentType } from 'services/visa/interface';

const VisaContainer: FC<VisaLandingContentType> = ({ content }) => {
  const { isMobile } = useDeviceDetect();
  const isWeb = useWeb();
  const visatracking = new VisaTracking();

  useEffect(() => {
    const visaObject: Array<IVisa> = [
      //Order of this countries is important, be sure they match with site visa countries order
      // {visaTitle: content?.dubai?.title, brand: visaCountires.Dubai},
      // {visaTitle: content?.russia?.title, brand: visaCountires.Russia},
    ];
    visatracking.viewItemList(visaObject);
  }, []);

  const data = content?.attributes;
  const pageContentData = {
    explanation: data?.explanation,
    typeContent: data?.type_contents,
    price: data?.price,
    issuance: data?.visa_issuance,
    additionalContent: data?.additional_content,
    caption: data?.caption,
    faq: data?.faq,
  };
  return (
    <div dir="rtl">
      <div className={cn(isMobile && 'mx-n3')}>
        <Image
          width={1920}
          height={528}
          className={styles['visa-container__banner']}
          src={`${process.env.NEXT_PUBLIC_CMS_DOMAIN}${data?.cover?.data?.attributes?.url}`}
          alt="visa banner"
        />
      </div>
      <div className={cn(styles['visa-container__card'], 'container-lg')}>
        <h1 className={styles['visa-container__card__title']}>{data?.title}</h1>
      </div>
      <div className="container-lg p-0">
        <div className="d-flex flex-column gap-4">
          {data?.services.map((item) => {
            return (
              <VisaSection
                key={item.id}
                title={item.title}
                flag={`${process.env.NEXT_PUBLIC_CMS_DOMAIN}${item.flag_image.data.attributes.url}`}
                route={item.path}
                backgroundImageUrl={`${process.env.NEXT_PUBLIC_CMS_DOMAIN}${item.background_image.data.attributes.url}`}
              />
            );
          })}
        </div>
        <div className={styles['visa-container__visa-policy']}>
          <h2 className="tex-right fs-5 fw-500 color-on-surface">{data?.conditions?.title}</h2>
          <p className="mt-4 color-on-surface">{data?.conditions?.caption}</p>
          <div className={styles['visa-container__visa-policy__divider']} />
          {data?.conditions?.conditions?.map((item) => (
            <div key={item.title} className={styles['visa-container__visa-policy__list']}>
              <VisaPolicy title={item.title} />
            </div>
          ))}
        </div>
        {isWeb && <VisaPageContent data={pageContentData} />}
      </div>
    </div>
  );
};
export default VisaContainer;
