import {
  GenderType,
  TPassengerV2,
  TPassengerV2Payload,
} from 'services/general/passenger/interface';
import dayjs from 'dayjs';
import { TInternationalPassengerPayload } from 'services/internationalFlight/addPassenger/interface';
import {
  internationalFlightGenderConvertor,
  internationalFlightGenderEnum,
  internationalFlightPassengerEnum,
  internationalFlightPassengerTypeConvertor,
} from './typeConvertor';
import { ISelectedCountry } from 'containers/passengers/utilities/types';

export const addDomesticFlightPassengerMapper = (
  data: Record<string, string | number | ISelectedCountry | undefined>,
  isPassport: boolean,
): TPassengerV2Payload => {
  if (data?.passportId) {
    return {
      englishFamily: data?.englishFamily?.toString(),
      englishName: data?.englishName?.toString(),
      gender: data?.gender as GenderType,
      passengerType:
        (data?.passportCountry as ISelectedCountry)?.countryAlpha2 == 'IR'
          ? 'PASSENGER_TYPE_BOTH'
          : 'PASSENGER_TYPE_PASSPORT',
      countryId: (data?.passportCountry as ISelectedCountry)?.value?.toString(),
      passportId: data?.passportId?.toString(),
      birthdayString: isPassport ? `${data?.BirthYear}-${data?.BirthMonth}-${data?.BirthDay}` : '',
      hijriBirthdayString: !isPassport
        ? `${data?.BirthYear}-${data?.BirthMonth}-${data?.BirthDay}`
        : '',
      passportExpireDate: (
        new Date(`${data?.ExpireYear}-${data?.ExpireMonth}-${data?.ExpireDay}`).getTime() / 1000
      ).toString(),
      ...((data?.passportCountry as ISelectedCountry)?.countryAlpha2 == 'IR' && {
        nationalId: data?.nationalId?.toString(),
        persianFamily: data?.persianFamily?.toString(),
        persianName: data?.persianName?.toString(),
      }),
    };
  }
  return {
    persianFamily: data?.persianFamily?.toString(),
    persianName: data?.persianName?.toString(),
    englishFamily: data?.englishFamily?.toString(),
    englishName: data?.englishName?.toString(),
    gender: data?.gender as GenderType,
    passengerType: 'PASSENGER_TYPE_NATIONAL_CARD',
    nationalId: data?.nationalId?.toString(),
    hijriBirthdayString: `${data?.BirthYear}-${data.BirthMonth}-${data?.BirthDay}`,
  };
};

export const setPassengerMapper = (item: TPassengerV2): TInternationalPassengerPayload => {
  return {
    birthDate: item.birthday ? dayjs(Number(item.birthday) * 1000).format('YYYY-MM-DD') : '0',
    firstName: {
      english: item.englishName,
      persian: item.persianName,
    },
    lastName: {
      english: item.englishFamily,
      persian: item.persianFamily,
    },
    contactInfo: {
      email: '',
      phoneNumber: '',
    },
    gender: Object.values(internationalFlightGenderEnum).indexOf(
      internationalFlightGenderConvertor[item.gender || 'GENDER_TYPE_UNDEFINED'],
    ),
    nationality: item.nationality,
    nationalCode: item.nationalId,
    passengerId: item.id,
    passengerType: Object.values(internationalFlightPassengerEnum).indexOf(
      internationalFlightPassengerTypeConvertor[item?.ageType || 'AGE_TYPE_UNDEFINED'],
    ),
    passport: {
      expireDate: item.passportExpireDate
        ? dayjs(Number(item.passportExpireDate) * 1000).format('YYYY-MM-DD')
        : '0',
      issueCountryCode: item.countryObject?.countryAlpha2 || '0',
      number: item.passportId,
    },
  };
};
