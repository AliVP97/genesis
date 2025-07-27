import styles from '../visaContainer.module.scss';
import Image from 'next/image';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { PageContentData } from 'services/visa/interface';
import parse from 'html-react-parser';
import { FC } from 'react';
import FAQ from 'containers/landingPage/components/faq';
import Magazine from 'containers/landingPage/components/magazine';
import { visaMagazine } from 'containers/landingPage/data';

const VisaPageContent: FC<PageContentData> = ({ data }) => {
  const { isMobile } = useDeviceDetect();
  return (
    <div className={styles['visa-container__content']}>
      <div className="pt-4 pb-4">
        <Magazine magazines={visaMagazine} />
      </div>
      {data?.faq?.length !== 0 && (
        <div className="pt-4 pb-4">
          <FAQ faqs={data?.faq} />
        </div>
      )}
      <div>{data?.caption && parse(data?.caption)}</div>
      <div className="mt-4">
        <div className="text-justify">
          <div>{data?.typeContent && parse(data?.typeContent)}</div>
        </div>
      </div>
      <div>
        <div className="text-justify">
          <h2 className="fs-5 fw-500">{data?.explanation?.title}</h2>
          <div className="row flex-column-reverse flex-lg-row mt-3">
            <div className="col-md-12 col-lg-6">
              {data?.explanation?.content && parse(data?.explanation?.content)}
            </div>
            <div className="col-md-12 col-lg-6">
              <Image
                className="rounded-3"
                width={2117}
                height={1576}
                src={`${process.env.NEXT_PUBLIC_CMS_DOMAIN}${data?.explanation?.image?.data?.attributes?.url}`}
                alt="visa"
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles['visa-container__content']}>
        <div className="bg-color-blue-light-4 mt-4 px-4 py-3 rounded-4">
          <h2 className="fs-5 fw-500">{data?.price?.title}</h2>
          <div className="mt-3 text-center">
            <Image
              width={isMobile ? 528 : 984}
              height={isMobile ? 128 : 154}
              src={`${process.env.NEXT_PUBLIC_CMS_DOMAIN}${data?.price?.image?.data?.attributes?.url}`}
              alt="visa"
            />
          </div>
          {data?.price?.content && parse(data?.price?.content)}
        </div>
      </div>

      <div>
        <div className="text-justify mt-4">
          <h2 className="fs-5 fw-500">{data?.issuance?.title}</h2>
          <p className="mt-3 mb-4">{data?.issuance?.caption}</p>
          <div className="row flex-column-reverse flex-lg-row mt-3">
            <div className="col-md-12 col-lg-6">
              {data?.issuance?.content && parse(data?.issuance?.content)}
            </div>
            <div className="col-md-12 col-lg-6">
              <Image
                className="rounded-3"
                width={2117}
                height={1576}
                src={`${process.env.NEXT_PUBLIC_CMS_DOMAIN}${data?.issuance?.image?.data?.attributes?.url}`}
                alt="visa"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="pb-4">{data?.additionalContent && parse(data?.additionalContent)}</div>
    </div>
  );
};

export default VisaPageContent;
