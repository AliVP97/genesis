import path from 'path';

export const TYPE_DIR = path.resolve('./types/');

const SWAGGER_BASE_URL = {
  DEV: 'https://dev-api.780.ir/swagger-ui/',
  STAGE: 'https://stage-api.780.ir/swagger-ui/',
  INTERNATIONAL_FLIGHT: 'https://stage-api.780.ir/intl-fl-parto/swagger/v1/swagger',
};

export const SWAGGER_SERVICE_NAMES = [
  {
    baseUrl: SWAGGER_BASE_URL.DEV,
    serviceName: 'passenger',
  },
  {
    baseUrl: SWAGGER_BASE_URL.DEV,
    serviceName: 'routing',
  },
  {
    baseUrl: SWAGGER_BASE_URL.DEV,
    serviceName: 'payment',
  },
  {
    baseUrl: SWAGGER_BASE_URL.DEV,
    serviceName: 'ticket-pdf',
  },
  {
    baseUrl: SWAGGER_BASE_URL.DEV,
    serviceName: 'trips',
  },
  {
    baseUrl: SWAGGER_BASE_URL.DEV,
    serviceName: 'usermanager',
  },
  {
    baseUrl: SWAGGER_BASE_URL.DEV,
    serviceName: 'hotel',
  },
  {
    baseUrl: SWAGGER_BASE_URL.DEV,
    serviceName: 'wallet',
  },
  {
    baseUrl: SWAGGER_BASE_URL.DEV,
    serviceName: 'campaign',
  },
  {
    baseUrl: SWAGGER_BASE_URL.DEV,
    serviceName: 'tour',
  },
  {
    baseUrl: SWAGGER_BASE_URL.STAGE,
    serviceName: 'shoppingorder',
  },
  {
    baseUrl: SWAGGER_BASE_URL.STAGE,
    serviceName: 'domestic-flight-aggregator',
  },
  {
    baseUrl: SWAGGER_BASE_URL.STAGE,
    serviceName: 'rajatrain',
  },
  {
    baseUrl: SWAGGER_BASE_URL.STAGE,
    serviceName: 'bus',
  },
  {
    baseUrl: SWAGGER_BASE_URL.INTERNATIONAL_FLIGHT,
    fileName: 'international-flight',
  },
];
