import {
  GenderType,
  TPassengerV2Payload,
  TPassengerV2Response,
} from 'services/general/passenger/interface';
import { ISelectedCountry } from 'containers/passengers/utilities/types';
import { TFormPassportCountry, TMapPayload2Form, TMapPayload2FormResult } from './types';

export const mapForm2Payload = (
  data: Record<string, string | TFormPassportCountry | number | undefined>,
  isInternational = false,
): TPassengerV2Payload => {
  if (data?.passportId) {
    const newObject: TPassengerV2Payload = {
      englishFamily: data?.englishFamily?.toString(),
      englishName: data?.englishName?.toString(),
      gender: data?.gender as GenderType,
      countryId: (data?.passportCountry as TFormPassportCountry)?.value?.toString(),
      passportId: data?.passportId.toString(),
      passportExpireDate: (
        new Date(`${data?.ExpireYear}-${data?.ExpireMonth}-${data?.ExpireDay}`).getTime() / 1000
      ).toString(),
      passengerType:
        (data?.passportCountry as TFormPassportCountry)?.countryAlpha2 == 'IR'
          ? 'PASSENGER_TYPE_BOTH'
          : 'PASSENGER_TYPE_PASSPORT',
    };

    if (data?.persianName && data?.persianFamily) {
      newObject['persianName'] = data?.persianName?.toString();
      newObject['persianFamily'] = data?.persianFamily?.toString();
    }

    if ((data?.passportCountry as ISelectedCountry)?.countryAlpha2 == 'IR') {
      newObject['nationalId'] =
        (data?.passportCountry as ISelectedCountry)?.countryAlpha2 == 'IR'
          ? data?.nationalId?.toString()
          : '';
      newObject.hijriBirthdayString = `${data?.BirthYear}-${data.BirthMonth}-${data?.BirthDay}`;
    } else {
      newObject.birthdayString = `${data?.BirthYear}-${data.BirthMonth}-${data?.BirthDay}`;
    }

    if (isInternational) {
      newObject['persianFamily'] = data?.persianFamily?.toString();
      newObject['persianName'] = data?.persianName?.toString();
    }

    return newObject;
  }

  return {
    persianFamily: data?.persianFamily?.toString(),
    persianName: data?.persianName?.toString(),
    gender: data?.gender as GenderType,
    passengerType: 'PASSENGER_TYPE_NATIONAL_CARD',
    nationalId: data?.nationalId?.toString(),
    hijriBirthdayString: `${data?.BirthYear}-${data.BirthMonth}-${data?.BirthDay}`,
    ...(isInternational && {
      englishFamily: data?.englishFamily?.toString(),
      englishName: data?.englishName?.toString(),
    }),
  };
};

export const mapPayload2Form: TMapPayload2Form = (passenger) => {
  const newPassenger = JSON.parse(JSON.stringify(passenger)) as NonNullable<
    TPassengerV2Response['passengerList']
  >[number];

  const result = { ...newPassenger } as TMapPayload2FormResult;

  if (passenger?.countryObject?.id) {
    const { id, countryNameEn, countryNameFa, countryAlpha3, countryAlpha2 } =
      passenger.countryObject;

    result['passportCountry'] = {
      countryAlpha2,
      countryAlpha3,
      enLabel: countryNameEn,
      label: countryNameFa,
      value: id,
    };
  }

  return result;
};
