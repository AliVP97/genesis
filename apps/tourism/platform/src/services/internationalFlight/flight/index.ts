import request from 'services/axios';
import API from 'utils/routes/api';
import {
  TInternationalAvailabilityListResponse,
  TInternationalPrepareRequest,
  TInternationalPrepareResponse,
} from './interface';

export const getPrepareRequestId = async (
  query: TInternationalPrepareRequest,
  signal: AbortSignal | undefined,
) => {
  const { data }: { data: TInternationalPrepareResponse } = await request.post(
    API.INTERNATIONALFLIGHT.GET_PREPARE_REQUEST,
    query,
    { signal },
  );
  return data;
};

export const getTicketList = async (requestId: string, signal: AbortSignal | undefined) => {
  const { data }: { data: TInternationalAvailabilityListResponse } = await request.get(
    API.INTERNATIONALFLIGHT.GET_AVAILABILITY_LIST + `/${requestId}`,
    { signal: signal },
    // {
    //   params: {
    //     maxBatchSize: 20,
    //   },
    // },
  );
  return data;
};
