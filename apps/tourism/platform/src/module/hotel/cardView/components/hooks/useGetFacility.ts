import { useMemo } from 'react';
import { THotelList } from 'services/hotel/prepare/interface';
import { CompaniesListStateType } from 'containers/companiesList/types';
import { removeDuplications, RemoveDuplicationsArrayMemberType } from 'utils/helpers/global';
import { cloneDeep } from 'lodash';

export const useGetFacility = (hotelData: THotelList) => {
  const hotelFacility = useMemo(() => {
    return hotelData
      ?.map((item) =>
        item.facility?.map((el) => ({ title: el.name, logo: el?.icon, type: el.type })).flat(),
      )
      .flat();
  }, [hotelData]);
  const facilities: CompaniesListStateType = useMemo(() => {
    if (!hotelData || !hotelData?.length) return [];

    return removeDuplications(
      cloneDeep(hotelFacility!) as RemoveDuplicationsArrayMemberType[],
      'type',
    ).map((facility) => ({
      title: facility?.title,
      value: facility?.type,
      isSelected: false,
      logo: '',
      info: '',
    }));
  }, [hotelData]);

  return {
    facilities,
  };
};
