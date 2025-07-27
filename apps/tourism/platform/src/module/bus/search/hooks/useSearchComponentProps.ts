import { QueryFunctionContext, useQuery, useQueryClient, UseQueryOptions } from 'react-query';

import {
  DesktopOriginDestinationPropsType,
  DesktopOriginDestinationStateType,
  LocationType,
} from 'components/originDestination/interface';
import {
  getBusiestBusTransportServiceProviders,
  searchStations,
  stationQuery,
} from 'services/bus/stations';
import { TAdditionalData, TLocation, TLocationHistory } from '../types';
import {
  locationMapper,
  mapToDesktopOriginDestinationState,
  locationReverseMapper,
} from '../utils';
import { TBusStations } from 'services/bus/stations/interface';

type TUseSearchProps = {
  location: TLocation;
  submitLocation: (location: TLocation) => void;
  locationHistory: TLocationHistory | undefined;
  onClearLocationHistory: (e: LocationType) => void;
};

export const useSearchComponentProps = ({
  location,
  submitLocation,
  locationHistory,
  onClearLocationHistory,
}: TUseSearchProps): DesktopOriginDestinationPropsType<TBusStations, TAdditionalData> => {
  const { data: busiestTransportServiceProviders } = useQuery(
    ['busiestBusTransportServiceProviders'],
    getBusiestBusTransportServiceProviders,
    { enabled: true, staleTime: 30 * 60 * 1000 },
  );

  const defaultData = {
    title: 'شهرهای پرتردد',
    value: locationMapper(busiestTransportServiceProviders),
  };

  const state = location && mapToDesktopOriginDestinationState(location);

  const onSelect = (e: DesktopOriginDestinationStateType<TAdditionalData>) => {
    submitLocation(locationReverseMapper(e));
  };

  const api = {
    fetcher: async (ctx: QueryFunctionContext) => searchStations(ctx.queryKey[1] as string),
    dataMapper: locationMapper,
  };

  const queryClient = useQueryClient();

  const defaultQuery = (searchValue: string): UseQueryOptions<TBusStations> => {
    const { queryKey, staleTime, queryFn } = stationQuery(searchValue);

    return {
      queryKey,
      queryFn: queryFn as UseQueryOptions<TBusStations>['queryFn'],
      staleTime,
      onSuccess: (data) => {
        data?.stations?.forEach((station) => {
          if (station.seoCode) {
            queryClient.setQueryData(stationQuery(station.seoCode).queryKey, {
              stations: [station],
            });
          }
        });
      },
    };
  };

  return {
    defaultData,
    state,
    onSelect,
    api,
    history: locationHistory,
    onClearHistory: onClearLocationHistory,
    defaultQuery,
  };
};
