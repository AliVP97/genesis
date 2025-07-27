import { CreateOrderPassenger, PassengerPayload } from 'services/general/passenger/interface';

const PassengerConvertor = (data: PassengerPayload['body'][]): CreateOrderPassenger => {
  return data.map((el) => ({
    ageType: el.ageType,
    passengerID: el.id,
    nationalCode: el?.nationalId,
    nationality: el.nationalId ? 'IR' : el?.nationality,
    gender: el?.gender,
    passengerType: el?.passengerType,
    birthDate: el?.birthday,
    firstname: {
      farsi: el?.persianName,
      english: el?.englishName,
    },
    lastname: {
      farsi: el?.persianFamily,
      english: el?.englishFamily,
    },
    passport: {
      country: el?.passportCountry,
      expireDate: el.nationalId ? '' : el?.passportExpireDate,
      number: el?.phoneNumber,
      issueDate: '',
    },
  }));
};

export default PassengerConvertor;
