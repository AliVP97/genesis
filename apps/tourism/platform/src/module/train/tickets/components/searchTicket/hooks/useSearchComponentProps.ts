import { QueryFunctionContext, useQuery, useQueryClient, UseQueryOptions } from 'react-query';

import {
  DesktopOriginDestinationDataMapperInputType,
  DesktopOriginDestinationPropsType,
} from 'components/desktopOriginDestination/types';
import {
  DesktopOriginDestinationHistoryType,
  DesktopOriginDestinationOnSelectType,
  LocationType,
} from 'components/originDestination/interface';
import {
  getBusiestTransportServiceProviders,
  searchStations,
  stationQuery,
} from 'services/train/stations';
import { TInitialState } from '..';
import {
  desktopOriginDestinationDataMapper,
  mapToDesktopOriginDestinationState,
  mapToLocationState,
} from '../../../helper';
import { TrainSearchResponse } from 'services/train/stations/interface';
import { TLocationStateType } from 'module/train/tickets/interface';

type TUseSearchComponentProps = {
  location: TInitialState;
  submitLocation: (value: TInitialState) => void;
  locationHistory: DesktopOriginDestinationHistoryType;
  onClearLocationHistory: (e: LocationType) => void;
};

export const useSearchComponentProps = ({
  location,
  submitLocation,
  locationHistory,
  onClearLocationHistory,
}: TUseSearchComponentProps): DesktopOriginDestinationPropsType<TrainSearchResponse> => {
  const { data: busiestTransportServiceProviders } = useQuery(
    ['busiestTransportServiceProviders'],
    getBusiestTransportServiceProviders,
  );

  const defaultData = {
    title: 'شهرهای پرتردد',
    value: desktopOriginDestinationDataMapper(
      busiestTransportServiceProviders as DesktopOriginDestinationDataMapperInputType,
    ),
  };

  const state = mapToDesktopOriginDestinationState(location);

  const onSelect: DesktopOriginDestinationOnSelectType = (e) => {
    submitLocation(mapToLocationState(e as TLocationStateType));
  };

  const api = {
    fetcher: async (ctx: QueryFunctionContext) => searchStations(ctx.queryKey[1] as string),
    dataMapper: desktopOriginDestinationDataMapper,
  };

  const onClearHistory = onClearLocationHistory;

  const queryClient = useQueryClient();

  const defaultQuery = (searchValue: string): UseQueryOptions<TrainSearchResponse> => {
    const { queryFn, queryKey, staleTime } = stationQuery(searchValue);

    return {
      queryKey,
      staleTime,
      queryFn: queryFn as UseQueryOptions<TrainSearchResponse>['queryFn'],
      onSuccess: (data) => {
        data?.stations?.forEach((station) => {
          if (station.englishName && station.code) {
            const { queryKey } = stationQuery(
              station.englishName?.toLowerCase()?.split(' ').join('_'),
            );

            queryClient.setQueryData(queryKey, {
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
    onClearHistory,
    defaultQuery,
  };
};
