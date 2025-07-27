import { DomesticFlightIcon, PlaceIcon } from 'assets/icons';
import { TOriginDestinationLocationBase } from 'components/originDestination/interface';
import { TInternationalFlightSearchAirportsResponse } from 'services/internationalFlight/airports/interface';
import { components } from 'types/international-flight';

type Response = NonNullable<TInternationalFlightSearchAirportsResponse['results']>[number];

type IataType = components['schemas']['InternationalFlightPb.IATA_Types_IATAType'] | undefined;

export default function createOriginDestinationLocation(
  response: Response,
): TOriginDestinationLocationBase {
  const countryName = response.country?.name?.persian;
  const cityPersianName = response.city?.name?.persian || 'شهر نامشخص';
  const iataType = response.iata?.type;
  const iataCode = response.iata?.code;

  const result = {
    id: getId(iataType, response, iataCode),
    title: getTitle(iataType, cityPersianName, response),
    type: createType(iataType, iataCode),
    icon: getIcon(iataType),
    data: createData(response),
  } as TOriginDestinationLocationBase;

  if (iataType !== 'IATA_TYPE_CITY') {
    result.sideContent = iataCode;
    result.subTitle = createSubTitle(countryName, cityPersianName);
  }

  return result;
}

const getId = (
  iataType: IataType,
  response: Response,
  iataCode: string | undefined,
): string | undefined => (iataType === 'IATA_TYPE_CITY' ? response.city?.iata : iataCode);

const getIcon = (iataType: IataType): React.ReactNode =>
  iataType === 'IATA_TYPE_AIRPORT' ? (
    <DomesticFlightIcon className="fill-grey-2" />
  ) : (
    <PlaceIcon className="fill-grey-2" />
  );

const createSubTitle = (
  countryName: string | undefined,
  cityPersianName: string,
): string | undefined => (countryName ? `${countryName}، ${cityPersianName}` : cityPersianName);

const getTitle = (
  iataType: IataType,
  cityPersianName: string,
  response: Response,
): string | undefined =>
  iataType === 'IATA_TYPE_CITY' ? cityPersianName : response.airport?.name?.persian;

const createType = (iataType: IataType, iataCode: string | undefined) =>
  ({
    id: iataType === 'IATA_TYPE_CITY' ? 'ALL_AIRPORTS' : 'AIRPORT',
    title: iataType === 'IATA_TYPE_CITY' ? 'همه فرودگاه‌ها' : iataCode,
  }) as TOriginDestinationLocationBase['type'];

const createData = (response: Response) =>
  ({
    cityTitle: response.city?.name?.persian,
  }) as TOriginDestinationLocationBase['data'];
