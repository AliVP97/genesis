import { useMemo } from 'react';

import { useHotDestinations } from 'services/tour/v2';
interface Props {
  tourType: string;
}
export const useLocationInputs = ({ tourType }: Props) => {
  const { data: hotspots } = useHotDestinations(tourType);
  const defaultDataDestination = useMemo(
    () => ({
      title: 'مقاصد پرتردد',
      value: hotspots?.destinationFrequency?.map(({ isoCode, persianName, englishName }) => ({
        subTitle: isoCode,
        title: persianName,
        description: englishName,
      })),
    }),
    [hotspots?.destinationFrequency],
  );
  const defaultDataOrigin = useMemo(
    () => ({
      title: 'مبداهای پرتردد',
      value: hotspots?.originFrequency?.map(({ isoCode, persianName, englishName }) => ({
        subTitle: isoCode,
        title: persianName,
        description: englishName,
      })),
    }),
    [hotspots?.originFrequency],
  );

  return { defaultDataOrigin, defaultDataDestination };
};
