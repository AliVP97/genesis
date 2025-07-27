import { FromSchemaV2 } from 'containers/passengers/utilities/types';
import { definitions } from 'types/passenger';

type TPassengerV2Response = definitions['passengerV2PassengerModel'];

export type TFormPassportCountry = {
  countryAlpha2?: string;
  countryAlpha3?: string;
  enLabel?: string;
  label?: string;
  value?: string;
};

export type TFormKeys =
  | 'passportCountry'
  | 'englishName'
  | 'englishFamily'
  | 'persianName'
  | 'persianFamily'
  | 'gender'
  | 'nationalId'
  | 'BirthDay'
  | 'BirthMonth'
  | 'BirthYear'
  | 'passportId'
  | 'ExpireDay'
  | 'ExpireMonth'
  | 'ExpireYear'
  | 'BirthDay'
  | 'BirthMonth'
  | 'BirthYear';

type TFormFields =
  | 'passportCountry'
  | 'englishName'
  | 'englishFamily'
  | 'persianName'
  | 'persianFamily'
  | 'gender'
  | 'nationalId'
  | ['BirthDay', 'BirthMonth', 'BirthYear']
  | 'passportId'
  | ['ExpireDay', 'ExpireMonth', 'ExpireYear']
  | ['BirthDay', 'BirthMonth', 'BirthYear'];

export type TFormSchema = FromSchemaV2<TFormFields>;

export type TFormsSchema = Array<Array<TFormSchema>>;

export type TPassengerV2Mapper = {
  payloadId: Partial<keyof TPassengerV2Response>;
  type: 'react-select' | 'date';
  formId: TFormFields;
}[];

export type TMapPayload2FormResult = Record<
  TFormKeys,
  string | number | TFormPassportCountry | undefined
>;

export type TMapPayload2Form = (passenger: TPassengerV2Response) => TMapPayload2FormResult;
