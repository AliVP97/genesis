import { useQuery, UseQueryOptions } from 'react-query';

import { getTrainFreeOption } from 'services/train/servicesAndCatering';
import { TrainOptionPayload } from 'services/train/servicesAndCatering/interface';
import { QUERY_CONFIG } from './constants';

export const useFreeOptionalServices = (
  trainId: string | undefined,
  options?: Omit<UseQueryOptions<TrainOptionPayload['optionalServices']>, 'queryKey' | 'queryFn'>,
) => {
  const data = useQuery<TrainOptionPayload['optionalServices']>(
    ['free-optional-services', trainId],
    () => getTrainFreeOption(trainId as string),
    { ...options, enabled: !!trainId && options?.enabled, ...QUERY_CONFIG },
  );

  return data;
};
