import { usePrepareRequestHandler } from 'module/hotel/search/hooks/usePrepareRequestHandler';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TQueryObject } from 'module/hotel/ticketsSearchBox/interface';
import { queryToQueryString } from 'utils/helpers/global';

export const useDomesticHotelSearch = () => {
  const router = useRouter();

  const [queryObject, setQueryObject] = useState<TQueryObject>();
  const { prepareRequestHandler, requestIdData, prepareSuccess /* , loadingPrepare */ } =
    usePrepareRequestHandler();

  useEffect(() => {
    changeUrl(queryObject);
  }, [requestIdData]);

  const changeUrl = (queryObject?: TQueryObject) => {
    if (queryObject?.destinationType == 'hotel' && prepareSuccess) {
      void router.push(
        `/hotel/${queryObject.cityEng}/${router.query.uuid}` +
          `?hotelId=${queryObject?.requestId}&rooms=${queryObject?.rooms}&requestId=${router?.query?.requestId}`,
      );
    } else if (queryObject?.destinationType == 'city') {
      void router.push(
        {
          pathname: '/hotel/' + queryObject?.requestId,
          query: queryToQueryString(queryObject),
        },
        undefined,
        { shallow: true },
      );
    }
  };

  const search = async (queryObject: TQueryObject) => {
    setQueryObject(queryObject);
    if (queryObject?.destinationType == 'hotel') await prepareRequestHandler(queryObject);

    changeUrl(queryObject);
  };

  return search;
};
