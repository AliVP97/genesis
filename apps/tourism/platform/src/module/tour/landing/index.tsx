import React from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useLanding } from './hooks/useLanding';
import cn from 'classnames';
import styles from './swiper.module.scss';

import { TTourLandingContent } from 'containers/landingPage/types';
import { useWeb } from 'utils/hooks/useWeb';
import { TabbedArticle } from 'containers/landingPage/components/tabbedArticle';
import { tourFaqs, tourTabbedArticle } from 'containers/landingPage/data';
import FAQ from 'containers/landingPage/components/faq';
import { PromotionSlider, TabContent, TourList } from './components';
import { TSuggestionItem } from 'services/tour/v2/searchLocation/types';
import Skeleton from 'components/skeleton';

type TProps = {
  tourContent: TTourLandingContent;
};
export const LandingPage: React.FC<TProps> = ({ tourContent }) => {
  const content = tourContent?.service?.data[0]?.attributes;
  const isWeb = useWeb();
  const faqContent = content?.faq;

  const tourTabbedArticleData = {
    title: content?.title,
    cover: content?.cover,
    content: content?.more_content,
    description: content?.description,
    tabs: content?.tabs,
  };
  const { tourSuggestion, activeTab, setActiveTab, tourData, isLoadingTour } = useLanding();
  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className={cn(styles.swiper, 'pt-4')}>
      <div className="rtl pt-4">
        <div className="z-0">
          <div className="rtl">
            {isLoadingTour && (
              <Skeleton
                type="tourLandingSuggestion"
                rtl
                uniqueKey="sort"
                className="bg-color-white ps-2 "
                height="200"
                width="100%"
              />
            )}
            {isLoadingTour && (
              <Skeleton
                type="tourLandingSuggestion"
                rtl
                uniqueKey="sort"
                className="bg-color-white ps-2 pt-5"
                height="200"
                width="100%"
              />
            )}

            {tourData?.list?.map((list) => <TourList key={`${list.title}`} list={list} />)}
          </div>
        </div>
        <br />
        <PromotionSlider />
        {isLoadingTour && (
          <Skeleton
            type="tourLandingSuggestion"
            rtl
            uniqueKey="sort"
            className="bg-color-white ps-2 "
            height="200"
            width="100%"
          />
        )}
        <div className={cn(styles['tab-navigation'], 'pb-5')}>
          <div className="text-weight-700 fs-6 pt-5 pb-2">تورهای پیشنهادی هف هشتاد</div>
          <div className={styles['tab-navigation__tabs']}>
            {tourSuggestion?.categories?.map((tab, index) => (
              <div
                key={index}
                className={cn(
                  `${styles['tab-navigation__tab']} ${activeTab === index && styles.active}`,
                  'px-4 py-3',
                )}
                onClick={() => handleTabChange(index)}
              >
                {tab?.category}
              </div>
            ))}
          </div>
          {tourSuggestion?.categories && (
            <TabContent content={tourSuggestion?.categories[activeTab]?.items as TSuggestionItem} />
          )}
        </div>
        {isWeb && (
          <>
            <TabbedArticle data={tourTabbedArticleData} staticData={tourTabbedArticle} />

            <div className={cn('container-xl')}>
              <div className="rtl">
                <div className="mt-5">
                  <FAQ faqs={faqContent} staticData={tourFaqs} />
                </div>
              </div>
            </div>
          </>
        )}

        <br />
      </div>
    </div>
  );
};
