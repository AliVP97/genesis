import request from 'services/axios';
import { QueryFunctionContext } from 'react-query';
import API from 'utils/routes/api';
import { TInternationalFlightSearchAirportsResponse } from './interface';

export const getAirports = async (ctx: QueryFunctionContext) => {
  const { data }: { data: TInternationalFlightSearchAirportsResponse } = await request.get(
    API.INTERNATIONALFLIGHT.GET_AIRPORTS,
    {
      params: ctx.queryKey[1],
    },
  );
  return data;
};

export const getBusiestTransportServiceProviders = async () => {
  const { data }: { data: TInternationalFlightSearchAirportsResponse } = await request.get(
    API.INTERNATIONALFLIGHT.GET_BUSIEST_TRANSPORT_SERVICE_PROVIDERS,
  );
  return data;
};
