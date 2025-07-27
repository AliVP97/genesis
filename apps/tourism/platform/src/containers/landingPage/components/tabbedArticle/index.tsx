import { useState } from 'react';
import Image from 'next/image';
import { ArrowDownIcon, ArrowUpIcon } from 'assets/icons';
import parse from 'html-react-parser';
import style from './style.module.scss';
import styles from 'components/skeleton/skeleton.module.scss';
import { TFlightContentsImage, TFlightContentsTabs } from 'services/domestic/flight/interface';
import Skeleton from 'components/skeleton';
import { ITabbedArticle } from 'containers/landingPage/types';

type TArticleFlightData = {
  title?: string;
  content?: string;
  description?: string;
  tabs?: TFlightContentsTabs;
  cover?: TFlightContentsImage;
};

type TProps = {
  data?: TArticleFlightData | undefined;
  loading?: boolean;
  staticData?: ITabbedArticle;
};

const TabbedArticle = ({ data, loading, staticData }: TProps) => {
  const [moreIsVisible, setMoreIsVisible] = useState(false);
  const { title, cover, description, content } = data || {};

  const handleReadMoreClick = () => {
    setMoreIsVisible(!moreIsVisible);
  };

  return (
    <div className={style['main']}>
      {loading ? (
        <>
          <Skeleton type="title" uniqueKey="title" className={styles['skeleton__title']} />
          <div className="d-md-flex justify-content-md-around w-75">
            <Skeleton type="list" uniqueKey="list" width="100%" />
            <Skeleton type="image" uniqueKey="image" width="100%" height="300" />
          </div>
        </>
      ) : (
        <div className="container d-flex justify-content-center align-items-start flex-column px-md-5">
          <div className={style['intro']}>
            <h1 className={style['title']}>{title ? title : staticData?.title}</h1>
            <div className={style['image']}>
              {!cover ? (
                <Image
                  src={staticData?.image || ''}
                  alt="هتل هف‌هشتاد"
                  layout="responsive"
                  objectFit="cover"
                  width=""
                />
              ) : (
                <Image
                  src={`${process.env.NEXT_PUBLIC_CMS_DOMAIN}${cover?.data?.attributes?.formats.small.url}`}
                  alt={title}
                  layout="responsive"
                  objectFit="fill"
                  width={cover?.data?.attributes?.formats.small.width ?? 230}
                  height={cover?.data?.attributes?.formats.small.height ?? 320}
                />
              )}
            </div>
            <div className={style['text']}>
              {description ? parse(description || '') : staticData?.body}
            </div>
          </div>
          <div className={`${style['more']} ${!moreIsVisible ? style['invisible'] : ''}`}>
            {content ? parse(content as string) : parse(staticData?.content as string)}
          </div>
          <button className={style['toggle-button']} onClick={handleReadMoreClick}>
            {moreIsVisible ? (
              <>
                بستن متن
                <ArrowUpIcon />
              </>
            ) : (
              <>
                مشاهده تمام متن <ArrowDownIcon />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
export { TabbedArticle };
