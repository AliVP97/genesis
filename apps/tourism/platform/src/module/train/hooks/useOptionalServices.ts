import { useQuery, UseQueryOptions } from 'react-query';

import { getTrainOption } from 'services/train/servicesAndCatering';
import { TrainOptionPayload } from 'services/train/servicesAndCatering/interface';
import { QUERY_CONFIG } from './constants';

export const useOptionalServices = (
  trainId: string | undefined,
  options?: Omit<UseQueryOptions<TrainOptionPayload['optionalServices']>, 'queryKey' | 'queryFn'>,
) => {
  const data = useQuery<TrainOptionPayload['optionalServices']>(
    ['optional-services', trainId],
    () => getTrainOption(trainId as string),
    { ...options, enabled: !!trainId && options?.enabled, ...QUERY_CONFIG },
  );

  return data;
};
