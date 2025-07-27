import { useMutation } from 'react-query';
import { prepareHotel } from 'services/hotel/prepare';
import jmoment from 'moment-jalaali';
import { TGetHotelSearchIdRequest, TPersonAgeType } from 'services/hotel/prepare/interface';
import { TQueryObject } from 'module/hotel/ticketsSearchBox/interface';
import { useRouter } from 'next/router';
import { removeCookie, setCookie } from 'utils/helpers/coockieHelper';
import { notify } from 'utils/notification';
export const usePrepareRequestHandler = () => {
  const { query, replace } = useRouter();
  const {
    mutate: mutatePrepareHotel,
    data: requestIdData,
    isLoading: loadingPrepare,
    isSuccess: prepareSuccess,
  } = useMutation({
    mutationFn: async (payload: TGetHotelSearchIdRequest) => {
      const today = new Date();
      const checkInDate = new Date(String(payload.checkInDate));
      checkInDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      if (checkInDate < today) {
        notify({ type: 'error', message: 'تاریخ ورود معتبر نیست' });
        replace('/hotel');
        return;
      }
      return prepareHotel(payload);
    },
    mutationKey: 'getHotelIdRequest',
    onSuccess: (requestIdData) => {
      removeCookie('uuid');
      setCookie('uuid', requestIdData?.requestId as string, Number(requestIdData?.expireTime));
      const currentDate = new Date().getTime();
      localStorage.setItem(
        'uuid-expiry',
        JSON.stringify(currentDate + Number(requestIdData?.expireTime) * 1000),
      );
    },
  });

  const prepareRequestHandler = (queryObject?: TQueryObject) => {
    const rooms = (queryObject ? (queryObject?.rooms as string) : (query.rooms as string))?.split(
      '-',
    );
    const roomsFromQuery = rooms?.map((room) => {
      const typeAges = room.split('___');
      let listAdult: TPersonAgeType[] = [];
      const adult = typeAges[0].split(',');
      listAdult = adult.map(() => ({
        ageType: 'ADULT',
      }));
      let listChild: TPersonAgeType[] = [];
      if (typeAges[1]) {
        const childs = typeAges[1].split(',');
        listChild = childs.map((item) => ({
          ageType: item as TPersonAgeType['ageType'],
        }));
      }
      return { person: [...listAdult, ...listChild] };
    });

    const payload = queryObject
      ? {
          rooms: roomsFromQuery,
          cityId:
            queryObject?.destinationType == 'city' ? queryObject.requestId : queryObject.cityId,
          hotelId: queryObject?.destinationType == 'hotel' ? queryObject.requestId : '',

          checkInDate: jmoment(queryObject?.checkInDate as string, 'jYYYY-jMM-jDD').format(
            'YYYY-MM-DD',
          ),
          checkOutDate: jmoment(queryObject?.checkOutDate as string, 'jYYYY-jMM-jDD').format(
            'YYYY-MM-DD',
          ),
        }
      : {
          rooms: roomsFromQuery,
          cityId: query?.cityId?.length !== 0 ? (query.requestId as string) : '',
          hotelId: query?.hotelId?.length !== 0 ? (query.hotelId as string) : '',
          checkInDate: jmoment(query?.checkInDate as string, 'jYYYY-jMM-jDD').format('YYYY-MM-DD'),
          checkOutDate: jmoment(query?.checkOutDate as string, 'jYYYY-jMM-jDD').format(
            'YYYY-MM-DD',
          ),
        };
    mutatePrepareHotel(payload);
  };
  return { prepareRequestHandler, requestIdData, loadingPrepare, prepareSuccess };
};
