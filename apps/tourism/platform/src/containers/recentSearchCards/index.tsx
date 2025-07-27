import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import queryString from 'query-string';

import { TAdditionalData } from 'module/bus/search/types';
import { TTrainAdditionalData } from 'module/train/tickets/interface';
import { getServiceName } from 'utils/helpers/serviceDetector';
import { Card } from './components/card';
import {
  getBusCardsData,
  getBusQueryObject,
  getDomesticFlightCardsData,
  getDomesticFlightQueryObject,
  getDomesticHotelCardsData,
  getDomesticHotelQueryObject,
  getInternationalFlightCardsData,
  getInternationalFlightQueryObject,
  getTrainCardsData,
  getTrainQueryObject,
  isRepeated,
  sortLocalStorage,
} from './helper';
import { useDomesticHotelSearch } from './hooks/useDomesticHotelSearch';
import { TRecentSearchCardData, TRecentSearchCardsData } from './types';

import style from './style.module.scss';

export const RecentSearchCards = () => {
  const { pathname, push } = useRouter();

  const [cardsData, setCardsData] = useState<TRecentSearchCardsData>();

  const domesticHotelSearch = useDomesticHotelSearch();

  // set cards data:
  useEffect(() => {
    let data;
    switch (getServiceName(pathname)) {
      case 'flights':
        data = getDomesticFlightCardsData();
        break;
      case 'international':
        data = getInternationalFlightCardsData();
        break;
      case 'train':
        data = getTrainCardsData();
        break;
      case 'bus':
        data = getBusCardsData();
        break;
      case 'hotel':
        data = getDomesticHotelCardsData();
        break;
    }

    const cleanData = data?.filter(
      (dataItem) =>
        dataItem.departureDate && dataItem.departureDate >= new Date().setHours(0, 0, 0, 0), // today
    );

    setCardsData(cleanData);
  }, [pathname]);

  const handleCardClick = (card: TRecentSearchCardData) => {
    const serviceName = getServiceName(pathname);

    if (serviceName === 'hotel') {
      const queryObject = getDomesticHotelQueryObject(card.index);
      sortLocalStorage('hotel', card.index);
      if (queryObject) {
        queryObject.readCache = 'true';
      }
      if (queryObject) {
        domesticHotelSearch(queryObject);
      }
    } else {
      // create query object:
      let queryObject;
      let originId = card.origin?.id;
      let destinationId = card.destination?.id;
      switch (serviceName) {
        case 'flights':
          queryObject = getDomesticFlightQueryObject(card.index);
          break;
        case 'international':
          queryObject = getInternationalFlightQueryObject(card.index);
          break;
        case 'train':
          ((newCard: TRecentSearchCardData<TTrainAdditionalData>) => {
            queryObject = getTrainQueryObject(newCard.index);
            if (newCard?.origin?.data?.englishName) {
              originId = newCard.origin.data.englishName;
            }

            if (newCard?.destination?.data?.englishName) {
              destinationId = newCard.destination.data.englishName;
            }
          })(card as TRecentSearchCardData<TTrainAdditionalData>);
          break;
        case 'bus':
          ((newCard: TRecentSearchCardData<TAdditionalData>) => {
            queryObject = getBusQueryObject(newCard.index);
            if (newCard.origin?.data?.seoCode) {
              originId = newCard.origin?.data?.seoCode;
            }

            if (newCard.destination?.data?.seoCode) {
              destinationId = newCard.destination?.data?.seoCode;
            }
          })(card as TRecentSearchCardData<TAdditionalData>);
          break;
      }

      sortLocalStorage(serviceName, card.index);

      // push:
      if (queryObject) {
        void push(
          {
            pathname: `/${serviceName}/` + originId + '-' + destinationId,
            query: queryString.stringify(queryObject),
          },
          undefined,
          { shallow: true },
        );
      }
    }
  };

  const today = new Date();
  const startOfToday = today.setHours(0, 0, 0, 0);

  // Filter valid cards based on the below conditions
  const validCards = cardsData?.filter(
    (card) =>
      card.departureDate &&
      startOfToday <= card.departureDate &&
      card.origin?.id &&
      card.destination?.id &&
      !isRepeated(card, cardsData),
  );

  return validCards?.length ? (
    <div className={style.main}>
      <div className={style.title}>جستجوهای اخیر</div>
      <div className={style.cards}>
        {validCards?.map((card) => {
          return (
            <Card
              key={card.index}
              data={{
                index: card.index,
                calendarSystem: card.calendarSystem,
                origin: card.origin,
                destination: card.destination,
                departureDate: card.departureDate,
                returnDate: card.returnDate,
              }}
              onClick={() => handleCardClick(card)}
            />
          );
        })}
      </div>
    </div>
  ) : null;
};
