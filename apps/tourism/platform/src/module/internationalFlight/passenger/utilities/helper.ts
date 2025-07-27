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

export const addPassengerMapper = (
  data: Record<string, string | number | ISelectedCountry | undefined>,
  shouldSendHijri = true,
): TPassengerV2Payload => {
  return {
    englishFamily: data?.englishFamily?.toString(),
    englishName: data?.englishName?.toString(),
    gender: data?.gender as GenderType,
    passengerType:
      (data?.passportCountry as ISelectedCountry)?.countryAlpha2 == 'IR'
        ? 'PASSENGER_TYPE_BOTH'
        : 'PASSENGER_TYPE_PASSPORT',
    countryId: (data?.passportCountry as ISelectedCountry)?.value,
    passportId: data?.passportId?.toString(),

    birthdayString: `${data?.BirthYear}-${data.BirthMonth}-${data?.BirthDay}`,
    hijriBirthdayString: shouldSendHijri
      ? dayjs(new Date(`${data?.BirthYear}-${data.BirthMonth}-${data?.BirthDay}`).getTime())
          .calendar('jalali')
          .format('YYYY-MM-DD')
      : '',
    passportExpireDateString: `${data?.ExpireYear}-${data?.ExpireMonth}-${data?.ExpireDay}`,
    hijriPassportExpiredDateString: shouldSendHijri
      ? dayjs(new Date(`${data?.ExpireYear}-${data?.ExpireMonth}-${data?.ExpireDay}`).getTime())
          .calendar('jalali')
          .format('YYYY-MM-DD')
      : '',
    ...((data?.passportCountry as ISelectedCountry)?.countryAlpha2 == 'IR' && {
      nationalId:
        (data?.passportCountry as ISelectedCountry)?.countryAlpha2 == 'IR'
          ? data?.nationalId?.toString()
          : '',
    }),
  };
};

export const setPassengerMapper = (item: TPassengerV2): TInternationalPassengerPayload => {
  return {
    birthDate: item.birthdayString,
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
      issueCountryCode: item.countryObject?.countryNameEn || '0',
      number: item.passportId,
    },
  };
};
