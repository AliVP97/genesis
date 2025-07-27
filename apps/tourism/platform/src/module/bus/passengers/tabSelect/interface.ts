import {
  CountriesList,
  PassengerPayload,
  TPassengerType,
} from 'services/general/passenger/interface';

export type TypeProps = 'nationalCode' | 'passport';
export interface NationalFormProps {
  BirthDay: string;
  BirthMonth: string;
  BirthYear: string;
  englishName: string;
  englishFamily: string;
  persianName: string;
  persianFamily: string;
  gender: string;
  nationalId: string;
  id?: string;
  birthday?: string;
  passengerType?: string;
  phoneNumber: string;
}
export interface PassportFormProps {
  ExpireDay: string;
  ExpireMonth: string;
  ExpireYear: string;
  BirthDay: string;
  BirthMonth: string;
  BirthYear: string;
  englishName: string;
  englishFamily: string;
  gender: string;
  passportId: string;
  countryId: string;
  id?: string;
  birthday?: string;
  passportExpireDate?: string;
  passengerType?: string;
  nationalId: string;
}
export interface ResultProps {
  BirthDay?: string;
  BirthMonth?: string;
  BirthYear?: string;
  englishName: string;
  englishFamily: string;
  persianName?: string;
  persianFamily?: string;
  gender: string;
  nationalId?: string;
  birthday?: string;
  ExpireDay?: string;
  ExpireMonth?: string;
  ExpireYear?: string;
  passportCountry?: string;
  passportId?: string;
  passportExpireDate?: string;
  passengerType?: string;
}
export interface CheckoutFormProps {
  OffCode: string;
  id?: string;
  persianName: string;
  persianFamily: string;
  passengerType?: string;
  ageType?: string;
}
export interface ComponentProps {
  closeModal?: () => void;
  editData?: TPassengerType | null;
  handleFormSubmit?: (data: TPassengerType) => void;
  options?: CountriesList[];
  isMobile?: boolean;
  isLogin?: boolean;
  setLocalPassenger?: (passenger: PassengerPayload['body']) => void;
  isAdd?: boolean;
  containerSize?: string;
  footerDescription?: string | undefined;
  isSuccess: boolean;
}
