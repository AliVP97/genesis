import { definitions, operations } from 'types/passenger';
import { definitions as shoppingorder } from 'types/shoppingorder';

export type fetchPassengerList = definitions['passengerPassengerListResponse'];
export type IPassenger = definitions['passengerPassengerModel'];
export type AddPassenger = operations['Passenger_AddPassenger'];

export type EditPassenger = operations['Passenger_UpdatePassenger'];

export type DeletePassenger = operations['Passenger_DeletePassenger'];

export type PassengerPayload = {
  body: definitions['passengerPassengerModel'] & { countryId?: string };
  id: string;
};
export type PassengerV2EditPayload = {
  body: Record<string, string | number>;
  id: string;
};

export type TPassengerV2Payload = definitions['passengerV2AddPassengerModel'];

export type TPassengerV2 = definitions['passengerV2PassengerModel'];
export type TPassengerV2Response = definitions['passengerV2PassengerListResponse'];
export type TPassengerType = TPassengerV2 & {
  countryId: string;
  BirthDay: string;
  BirthMonth: string;
  BirthYear: string;
  ExpireDay: string;
  ExpireMonth: string;
  ExpireYear: string;
};

export type PassengerType = definitions['passengerPassengerType'];
export type GenderType = definitions['passengerGenderType'];
export type CreateOrderPassenger = shoppingorder['apishoppingorderPassenger'][];
export type CountriesList = definitions['passengerCountryModel'];

export type CountryResponse = definitions['passengerGetCountriesResponse'];
export type PassengerListPayload = shoppingorder['apishoppingorderPassenger'][];
