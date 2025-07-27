import { UseQueryOptions } from 'react-query';
import { TrainOptionPayload } from 'services/train/servicesAndCatering/interface';

export const QUERY_CONFIG: Omit<
  UseQueryOptions<TrainOptionPayload['optionalServices']>,
  'queryKey' | 'queryFn'
> = {
  cacheTime: 30000,
};
