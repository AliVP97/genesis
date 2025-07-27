import React from 'react';
import { ShowMore } from 'components/showMoreBtn';
import { IBusyRoute, IResponseBusyRoute } from 'containers/landingPage/types';
import style from './style.module.scss';
import parse from 'html-react-parser';

export const BusyRoutesDescription = ({
  localContent,
  cmsContent,
}: {
  localContent?: Array<IBusyRoute>;
  cmsContent?: IResponseBusyRoute;
}) => {
  if (cmsContent) {
    return (
      <div dir="rtl" className={style['main-container']}>
        <ShowMore
          title={cmsContent?.attributes.title}
          className={style['main-container__show-more-btn']}
          expandedData={parse(cmsContent?.attributes?.content)}
          closedData={parse(cmsContent?.attributes?.short_content)}
        />
      </div>
    );
  }
  return (
    <div>
      {localContent?.map((item, index) =>
        item?.routes.map((route) => (
          <div className={style['main-container']} key={index.toString() + item.title}>
            <ShowMore
              className={style['main-container__show-more-btn']}
              expandedData={route?.content?.description?.body}
              closedData={route?.content?.title?.body}
            />
          </div>
        )),
      )}
    </div>
  );
};
